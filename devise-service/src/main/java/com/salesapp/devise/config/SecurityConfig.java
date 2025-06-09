package com.salesapp.devise.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // désactive la protection CSRF (utile pour test API REST)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(new AntPathRequestMatcher("/**")).permitAll() // autorise toutes les requêtes API sans authentification
                        .anyRequest().permitAll() // autorise toutes les autres requêtes aussi (ex: Swagger, etc.)
                )
                .cors(Customizer.withDefaults()) // active la configuration CORS
                .httpBasic(Customizer.withDefaults()); // optionnel (auth basique), à supprimer si inutile

        return http.build();
    }
}
