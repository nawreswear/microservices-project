package com.salesapp.auth.controller;

import com.salesapp.auth.dto.JwtResponse;
import com.salesapp.auth.dto.LoginRequest;
import com.salesapp.auth.dto.RegisterRequest;
import com.salesapp.auth.model.User;
import com.salesapp.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@Validated
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            JwtResponse jwtResponse = authService.authenticate(loginRequest);
            return ResponseEntity.ok(jwtResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User user = authService.register(registerRequest);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestParam String token) {
        boolean isValid = authService.validateToken(token);
        return ResponseEntity.ok(isValid);
    }
    
    @GetMapping("/user")
    public ResponseEntity<String> getUserFromToken(@RequestParam String token) {
        if (authService.validateToken(token)) {
            String username = authService.getUsernameFromToken(token);
            return ResponseEntity.ok(username);
        }
        return ResponseEntity.badRequest().build();
    }
}