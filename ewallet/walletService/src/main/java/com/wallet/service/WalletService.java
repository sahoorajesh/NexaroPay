package com.wallet.service;

import com.util.kafka.UserCreatedPayload;
import com.wallet.entity.Wallet;
import com.wallet.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WalletService {

    @Autowired
    private WalletRepository walletRepository;

    public void createWallet(UserCreatedPayload userCreatedPayload){
        Wallet wallet = Wallet.builder()
                .userId(userCreatedPayload.getUserId())
                .userEmail(userCreatedPayload.getUserEmail())
                .balance(100.0)
                .build();
        walletRepository.save(wallet);
    }
}
