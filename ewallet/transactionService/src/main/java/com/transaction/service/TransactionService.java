package com.transaction.service;

import com.transaction.dto.MonthlyWalletAnalysisDTO;
import com.transaction.dto.TransactionListItemDTO;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.ZoneId;
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

    public Page<TransactionListItemDTO> getTransactionsForUser(Long userId, int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.clamp(size, 1, 50);
        PageRequest pageRequest = PageRequest.of(
                safePage,
                safeSize,
                Sort.by(Sort.Direction.DESC, "txnCreatedDate")
        );

        return transactionRepository
                .findByFromUserIdOrToUserId(userId, userId, pageRequest)
                .map(this::toListItem);
    }

    public MonthlyWalletAnalysisDTO getMonthlyAnalysis(Long userId) {
        ZoneId zoneId = ZoneId.systemDefault();
        OffsetDateTime periodStart = OffsetDateTime.now(zoneId)
                .withDayOfMonth(1)
                .toLocalDate()
                .atStartOfDay(zoneId)
                .toOffsetDateTime();
        OffsetDateTime periodEnd = periodStart.plusMonths(1);

        boolean hasTransactions = transactionRepository.existsByFromUserIdOrToUserId(userId, userId);
        double spent = 0D;
        double received = 0D;

        for (Transaction txn : transactionRepository.findByFromUserIdAndTxnCreatedDateGreaterThanEqualAndTxnCreatedDateLessThanOrToUserIdAndTxnCreatedDateGreaterThanEqualAndTxnCreatedDateLessThan(
                userId,
                periodStart,
                periodEnd,
                userId,
                periodStart,
                periodEnd
        )) {
            if (txn.getStatus() != TransactionStatusEnum.SUCCESS || txn.getAmount() == null) {
                continue;
            }
            if (userId.equals(txn.getFromUserId())) {
                spent += txn.getAmount();
            }
            if (userId.equals(txn.getToUserId())) {
                received += txn.getAmount();
            }
        }

        return MonthlyWalletAnalysisDTO.builder()
                .hasTransactions(hasTransactions)
                .totalSpentThisMonth(spent)
                .totalReceivedThisMonth(received)
                .periodStart(periodStart)
                .periodEnd(periodEnd.minusNanos(1))
                .build();
    }

    private TransactionListItemDTO toListItem(Transaction txn) {
        return TransactionListItemDTO.builder()
                .txnId(txn.getTxnId())
                .fromUserId(txn.getFromUserId())
                .toUserId(txn.getToUserId())
                .amount(txn.getAmount())
                .status(txn.getStatus() == null ? null : txn.getStatus().toString())
                .comment(txn.getComment())
                .reason(txn.getReason())
                .txnCreatedDate(txn.getTxnCreatedDate())
                .txnLastUpdatedDate(txn.getTxnLastUpdatedDate())
                .build();
    }
}
