package com.wallet;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@SpringBootApplication(scanBasePackages = {"com.wallet", "com.util"})
public class WalletApp {
    public static void main(String[] args) {
        SpringApplication.run(WalletApp.class, args);

    }

    @Bean
    public RestTemplate restTemplate(List<ClientHttpRequestInterceptor> interceptors) {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.setInterceptors(interceptors);
        return restTemplate;
    }

}
