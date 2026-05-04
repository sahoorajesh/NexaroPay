package com.wallet.controller;

import com.wallet.dto.WalletInfoDTO;
import com.wallet.service.WalletService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("wallet-service")
public class WalletController {

    private static final Logger logger = LoggerFactory.getLogger(WalletController.class);
    @Autowired
    private WalletService walletService;

    @GetMapping("/wallet-details/{userId}")
    public WalletInfoDTO getWalletDetails(@PathVariable Long userId) throws ExecutionException, InterruptedException {
        logger.info("getWallet Details for userId = {}" , userId);
        return walletService.getWalletDetails(userId);
    }
}
