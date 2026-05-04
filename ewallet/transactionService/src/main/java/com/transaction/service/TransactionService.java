package com.transaction.service;

import com.transaction.dto.TransactionRequestDTO;
import com.transaction.dto.TransactionStatusDTO;
import com.transaction.entity.Transaction;
import com.transaction.entity.TransactionStatusEnum;
import com.transaction.repository.TransactionRepository;
import com.util.kafka.TxnInitPayload;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

@Service
public class TransactionService {

    private static final Logger LOGGER = LoggerFactory.getLogger(TransactionService.class);

    @Autowired
    private TransactionRepository transactionRepository;


    @Value("${txn.init.topic}")
    private String initTxnTopic;

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    @Transactional
    public String initTransaction(TransactionRequestDTO  transactionRequestDTO ) throws ExecutionException, InterruptedException {
        String txnId = UUID.randomUUID().toString();

        Transaction txn = Transaction.builder()
                .txnId(txnId)
                .toUserId(transactionRequestDTO.getToUserId())
                .fromUserId(transactionRequestDTO.getFromUserId())
                .amount(transactionRequestDTO.getAmount())
                .status(TransactionStatusEnum.PENDING)
                .comment(transactionRequestDTO.getComment())
                .build();
        txn = transactionRepository.save(txn);

        TxnInitPayload txnInitPayload = TxnInitPayload.builder()
                .transactionId(txnId)
                .fromUserId(txn.getFromUserId())
                .toUserId(txn.getToUserId())
                .amount(txn.getAmount())
                .requestId(MDC.get("requestId"))
                .build();

        Future<SendResult<String,Object>> future = kafkaTemplate
                .send(initTxnTopic, txnInitPayload.getFromUserId().toString(), txnInitPayload);

        LOGGER.info("Sent message to Kafka topic: {}", future.get());
        return txnId;
    }

    public TransactionStatusDTO getStatus(String txnId){
        Transaction txn = transactionRepository.findByTxnId(txnId);
        TransactionStatusDTO transactionStatusDTO = new TransactionStatusDTO();
        if(txn != null){
            transactionStatusDTO.setStatus(txn.getStatus().toString());
            transactionStatusDTO.setReason(txn.getReason());
        }
        return transactionStatusDTO;
    }
}
