package com.wallet.config;

import com.util.kafka.TxnInitPayload;
import com.util.kafka.UserCreatedPayload;
import com.wallet.service.WalletService;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.KafkaListener;
import tools.jackson.databind.ObjectMapper;

import java.util.concurrent.ExecutionException;

@Configuration
public class WalletKafkaConsumerConfig {
    private static final Logger logger = LoggerFactory.getLogger(WalletKafkaConsumerConfig.class);

    private static ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private WalletService walletService;

    @KafkaListener(topics = "${user.created.topic}", groupId = "wallet")
    public void consumeUserCreatedTopic(ConsumerRecord<?, ?> record) throws ExecutionException, InterruptedException {
        UserCreatedPayload userCreatedPayload = objectMapper.readValue(record.value().toString(), UserCreatedPayload.class);
        logger.info("Received from Kafka for User Creation: {}", userCreatedPayload);
        walletService.createWallet(userCreatedPayload);

    }

    @KafkaListener(topics = "${txn.init.topic}", groupId = "wallet")
    public void consumeInitTxnTopic(ConsumerRecord<?, ?> record) throws ExecutionException, InterruptedException {
        TxnInitPayload txnInitPayload = objectMapper.readValue(record.value().toString(), TxnInitPayload.class);
        logger.info("Received from Kafka for Init Transaction: {}", txnInitPayload);
        walletService.updateWalletForInitTxn(txnInitPayload);
        logger.info("Updated wallet for Init Transaction and marked the status: {}", txnInitPayload);
    }
}
