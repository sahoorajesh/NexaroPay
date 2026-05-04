package com.transaction.config;

import com.transaction.entity.Transaction;
import com.transaction.entity.TransactionStatusEnum;
import com.transaction.repository.TransactionRepository;
import com.util.kafka.TxnCompletedPayload;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.KafkaListener;
import tools.jackson.databind.ObjectMapper;

import java.util.concurrent.ExecutionException;

@Configuration
public class TransactionKafkaConsumerTopic {

    private static final Logger LOGGER = LoggerFactory.getLogger(TransactionKafkaConsumerTopic.class);

    private static ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    TransactionRepository transactionRepository;

    @KafkaListener(topics = "${txn.completed.topic}", groupId = "transaction")
    public void consumeCompletedTxnTopic(ConsumerRecord<?, ?> record) throws ExecutionException, InterruptedException {
        TxnCompletedPayload  txnCompletedPayload = objectMapper.readValue(record.value().toString(), TxnCompletedPayload.class);
        LOGGER.info("Received from Kafka for Completed Transaction: {}", txnCompletedPayload);
        MDC.put("requestId", txnCompletedPayload.getRequestId());
        Transaction transaction = transactionRepository.findByTxnId(txnCompletedPayload.getTxnId());
        if(!txnCompletedPayload.getSuccess()){
            transaction.setStatus(TransactionStatusEnum.FAILED);
            transaction.setReason(txnCompletedPayload.getReason());
        }
        else{
            transaction.setStatus(TransactionStatusEnum.SUCCESS);
        }
        transactionRepository.save(transaction);
        MDC.clear();
    }
}
