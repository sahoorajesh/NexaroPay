package com.transaction.repository;

import com.transaction.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Transaction findByTxnId(String txnId);

    Page<Transaction> findByFromUserIdOrToUserId(Long fromUserId, Long toUserId, Pageable pageable);

    boolean existsByFromUserIdOrToUserId(Long fromUserId, Long toUserId);

    List<Transaction> findByFromUserIdAndTxnCreatedDateGreaterThanEqualAndTxnCreatedDateLessThanOrToUserIdAndTxnCreatedDateGreaterThanEqualAndTxnCreatedDateLessThan(
            Long fromUserId,
            OffsetDateTime fromStart,
            OffsetDateTime fromEnd,
            Long toUserId,
            OffsetDateTime toStart,
            OffsetDateTime toEnd
    );
}
