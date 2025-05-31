package com.salesapp.facture;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class FactureServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(FactureServiceApplication.class, args);
    }
}