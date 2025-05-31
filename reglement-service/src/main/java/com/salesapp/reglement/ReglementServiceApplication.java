package com.salesapp.reglement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class ReglementServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ReglementServiceApplication.class, args);
    }
}