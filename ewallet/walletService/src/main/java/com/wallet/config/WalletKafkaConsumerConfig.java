package com.wallet.config;

import com.util.kafka.UserCreatedPayload;
import com.wallet.service.WalletService;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.KafkaListener;
import tools.jackson.databind.ObjectMapper;

@Configuration
public class WalletKafkaConsumerConfig {
    private static final Logger logger = LoggerFactory.getLogger(WalletKafkaConsumerConfig.class);

    private static ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private WalletService walletService;

    @KafkaListener(topics = "${user.created.topic}", groupId = "wallet")
    public void consumeUserCreatedTopic(ConsumerRecord<?, ?> record) {
        logger.info("Received from Kafka: {}", record);
        UserCreatedPayload userCreatedPayload = objectMapper.readValue(record.value().toString(), UserCreatedPayload.class);
        walletService.createWallet(userCreatedPayload);

    }
}
