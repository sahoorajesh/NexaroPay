package com.wallet.service;

import com.util.kafka.TxnCompletedPayload;
import com.util.kafka.TxnInitPayload;
import com.util.kafka.UserCreatedPayload;
import com.util.kafka.WalletUpdatedPayload;
import com.wallet.dto.WalletInfoDTO;
import com.wallet.entity.Wallet;
import com.wallet.repository.WalletRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

@Service
public class WalletService {

    private static final Logger LOGGER = LoggerFactory.getLogger(WalletService.class);

    @Autowired
    private WalletRepository walletRepository;

    @Value("${wallet.updated.topic}")
    private String walletUpdatedTopic;

    @Value("${txn.completed.topic}")
    private String txnCompletedTopic;

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    @Transactional
    public void createWallet(UserCreatedPayload userCreatedPayload) throws ExecutionException, InterruptedException {
        Wallet wallet = Wallet.builder()
                .userId(userCreatedPayload.getUserId())
                .userEmail(userCreatedPayload.getUserEmail())
                .balance(100.0)
                .build();
        wallet = walletRepository.save(wallet);

        WalletUpdatedPayload  walletUpdatedPayload = WalletUpdatedPayload.builder()
                .userId(wallet.getUserId())
                .walletId(wallet.getWalletId())
                .userEmail(wallet.getUserEmail())
                .newBalance(wallet.getBalance())
                .requestId(userCreatedPayload.getRequestId())
                .build();
        
        Future<SendResult<String,Object>> future = kafkaTemplate
                .send(walletUpdatedTopic, walletUpdatedPayload.getUserEmail(),walletUpdatedPayload);

        LOGGER.info("Sent message to Kafka topic: {}", future.get());

    }

    public WalletInfoDTO getWalletDetails(Long userId){

        Wallet wallet = walletRepository.findByUserId(userId);
        WalletInfoDTO infoDTO = new WalletInfoDTO();
        infoDTO.setWalletId(wallet.getWalletId());
        infoDTO.setBalance(wallet.getBalance());
        infoDTO.setUserId(wallet.getUserId());

        return infoDTO;
    }
    @Transactional
    public void updateWalletForInitTxn(TxnInitPayload txnInitPayload) throws ExecutionException, InterruptedException {
        Wallet fromWallet = walletRepository.findByUserId(txnInitPayload.getFromUserId());
        Wallet toWallet = walletRepository.findByUserId(txnInitPayload.getToUserId());
        Double amount = txnInitPayload.getAmount();
        TxnCompletedPayload txnCompletedPayload = new TxnCompletedPayload();
        txnCompletedPayload.setTxnId(txnInitPayload.getTransactionId());
        txnCompletedPayload.setRequestId(txnInitPayload.getRequestId());
        if(fromWallet.getBalance() < amount)
        {
            txnCompletedPayload.setSuccess(Boolean.FALSE);
            txnCompletedPayload.setReason("Low balance");
        } else
        {

            fromWallet.setBalance(fromWallet.getBalance() - amount);
            toWallet.setBalance(toWallet.getBalance() + amount);
            txnCompletedPayload.setSuccess(Boolean.TRUE);
            txnCompletedPayload.setReason("Amount " + amount + " INR has been transferred from " + txnInitPayload.getFromUserId());
            WalletUpdatedPayload  fromWalletUpdatedPayload =
                    new WalletUpdatedPayload(
                            fromWallet.getUserId(),
                            fromWallet.getWalletId(),
                            fromWallet.getUserEmail(),
                            fromWallet.getBalance(),
                            MDC.get("requestId")
                    );

            WalletUpdatedPayload  toWalletUpdatedPayload =
                    new WalletUpdatedPayload(
                            toWallet.getUserId(),
                            toWallet.getWalletId(),
                            toWallet.getUserEmail(),
                            toWallet.getBalance(),
                            MDC.get("requestId")
                    );
            Future<SendResult<String,Object>> fromWalletFuture = kafkaTemplate
                    .send(walletUpdatedTopic, fromWalletUpdatedPayload.getUserEmail(),fromWalletUpdatedPayload);

            LOGGER.info("Sent message to Wallet updated topic for From Wallet: {}", fromWalletFuture.get());

            Future<SendResult<String,Object>> toWalletFuture = kafkaTemplate
                    .send(walletUpdatedTopic, toWalletUpdatedPayload.getUserEmail(),toWalletUpdatedPayload);

            LOGGER.info("Sent message to Wallet updated topic for To Wallet: {}", toWalletFuture.get());
        }

        Future<SendResult<String,Object>> txnCompletedFuture = kafkaTemplate
                .send(txnCompletedTopic, txnInitPayload.getFromUserId().toString(),txnCompletedPayload);

        LOGGER.info("Sent message to Transaction Completed topic: {}", txnCompletedFuture.get());

    }
}
