package com.salesapp.auth.config;

import com.salesapp.auth.services.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.stream.Collectors;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final UserService userService;

    public SecurityConfig(UserService userService) {
        this.userService = userService;
    }

    // Provide the BCrypt password encoder bean
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // UserDetailsService loads user data and returns UserDetails with encoded password
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            var appUser = userService.getUserByName(username);
            if (appUser == null) {
                throw new UsernameNotFoundException("User not found: " + username);
            }
            return new User(
                    appUser.getUsername(),
                    appUser.getPassword(), // encoded password from DB
                    appUser.getRoles().stream()
                            .map(role -> new org.springframework.security.core.authority.SimpleGrantedAuthority(role.getRoleName()))
                            .collect(Collectors.toList())
            );
        };
    }

    // Provide AuthenticationManager bean
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // JwtAuthorizationFilter bean if you use JWT
    @Bean
    public JwtAuthorizationFilter jwtAuthorizationFilter(AuthenticationManager authManager) {
        return new JwtAuthorizationFilter(authManager);
    }

    // Security filter chain configuration
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,
                                           AuthenticationManager authManager,
                                           JwtAuthorizationFilter jwtAuthorizationFilter) throws Exception {

        http
                .csrf(csrf -> csrf.disable()) // disable CSRF for APIs
                .cors(cors -> {}) // enable CORS, you can configure separately
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // no session
                .headers(headers -> headers.frameOptions(frame -> frame.disable())) // allow H2 console frame
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers("/users/login").permitAll()
                        .requestMatchers("/users/register").permitAll()
                        .requestMatchers("/users/refreshToken").permitAll()
                        .requestMatchers(HttpMethod.POST, "/users/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/users/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
