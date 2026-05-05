package com.notification.config;

import com.util.kafka.UserCreatedPayload;
import com.util.kafka.WalletUpdatedPayload;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import tools.jackson.databind.ObjectMapper;

@Configuration
public class NotificationKafkaConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(NotificationKafkaConsumer.class);

    private static ObjectMapper mapper = new ObjectMapper();

    @Autowired
    private JavaMailSender mailSender;

    @KafkaListener(topics = "${user.created.topic}", groupId = "email")
    public void consumeUserCreatedTopic(ConsumerRecord<?,?> payload) {
        UserCreatedPayload  userCreatedPayload = mapper.readValue(payload.value().toString(), UserCreatedPayload.class);
        MDC.put("requestId", userCreatedPayload.getRequestId());
        LOGGER.info("Received user created payload: {}", userCreatedPayload);
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom("nexaroPay.ewallet@gmail.com");
        mailMessage.setTo(userCreatedPayload.getUserEmail());
        mailMessage.setSubject("Welcome " + userCreatedPayload.getUserName());
        mailMessage.setText("We are delighted to have you onboard");
        mailMessage.setCc("admin.nexaroPay@yopmail.com");
        mailSender.send(mailMessage);
        LOGGER.info("Mail Sent Successfully");
        MDC.clear();
    }

    @KafkaListener(topics = "${wallet.updated.topic}", groupId = "email")
    public void consumeWalletUpdatedTopic(ConsumerRecord<?,?> payload) {
        WalletUpdatedPayload walletUpdatedPayload = mapper.readValue(payload.value().toString(), WalletUpdatedPayload.class);
        MDC.put("requestId", walletUpdatedPayload.getRequestId());
        LOGGER.info("Received Wallet Updated payload: {}", walletUpdatedPayload);
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom("nexaroPay.ewallet@gmail.com");
        mailMessage.setTo(walletUpdatedPayload.getUserEmail());
        mailMessage.setSubject("Wallet Updated");
        mailMessage.setText("Your Wallet was updated recently. Your new Balance is :- " + walletUpdatedPayload.getNewBalance());
        mailMessage.setCc("admin.nexaroPay@yopmail.com");
        mailSender.send(mailMessage);
        LOGGER.info("Wallet Updated Mail Sent Successfully");
        MDC.clear();
    }
}
