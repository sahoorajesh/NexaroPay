package com.transaction.controller;

import com.transaction.dto.TransactionRequestDTO;
import com.transaction.dto.TransactionStatusDTO;
import com.transaction.service.TransactionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.logging.LoggerGroup;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transaction-service")
public class TransactionController {

    private static final Logger LOGGER = LoggerFactory.getLogger(TransactionController.class);

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/transfer")
    public ResponseEntity<String> initTxn(@RequestBody TransactionRequestDTO transactionRequestDTO) {
        LOGGER.info("Init transaction service with payload: {}", transactionRequestDTO);
        String txnId = null;
        try {
            txnId = transactionService.initTransaction(transactionRequestDTO);
        } catch (Exception e) {
            LOGGER.error("Error in init transaction service", e);
        }
        LOGGER.info("Init transaction service done");
        return ResponseEntity.accepted().body(txnId);
    }

    @GetMapping("/status/{txnId}")
    public ResponseEntity<TransactionStatusDTO> getStatus(@PathVariable("txnId") String txnId) {
        LOGGER.info("getting transaction service with txnId: {}", txnId);
        return ResponseEntity.ok(transactionService.getStatus(txnId));
    }
}

