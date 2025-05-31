package com.salesapp.dispositif;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class DispositifServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(DispositifServiceApplication.class, args);
    }
}