package com.transaction.repository;

import com.transaction.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Transaction findByTxnId(String txnId);

    Page<Transaction> findByFromUserIdOrToUserId(Long fromUserId, Long toUserId, Pageable pageable);
}
