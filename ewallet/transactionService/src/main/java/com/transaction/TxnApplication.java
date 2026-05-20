package com.transaction;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.transaction", "com.util"})
public class TxnApplication {
    public static void main(String[] args) {
        SpringApplication.run(TxnApplication.class, args);
    }
}
