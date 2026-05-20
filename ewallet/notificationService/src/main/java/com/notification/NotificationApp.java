package com.notification;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.notification", "com.util"})
public class NotificationApp {
    public static void main(String[] args) {

        SpringApplication.run(NotificationApp.class, args);
    }
}
