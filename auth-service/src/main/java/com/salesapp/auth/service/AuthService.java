package com.salesapp.auth.service;

import com.salesapp.auth.dto.JwtResponse;
import com.salesapp.auth.dto.LoginRequest;
import com.salesapp.auth.dto.RegisterRequest;
import com.salesapp.auth.model.Role;
import com.salesapp.auth.model.User;
import com.salesapp.auth.repository.UserRepository;
import com.salesapp.auth.util.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthService {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder encoder;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    public JwtResponse authenticate(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();

        return new JwtResponse(jwt, userDetails.getUsername(), userDetails.getEmail(), user.getRoles());
    }
    
    public User register(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        // Create new user's account
        User user = new User(registerRequest.getUsername(),
                           encoder.encode(registerRequest.getPassword()),
                           registerRequest.getEmail(),
                           registerRequest.getRoles());

        Set<Role> roles = new HashSet<>();
        if (registerRequest.getRoles() == null || registerRequest.getRoles().isEmpty()) {
            roles.add(Role.USER);
        } else {
            roles = registerRequest.getRoles();
        }

        user.setRoles(roles);
        return userRepository.save(user);
    }
    
    public boolean validateToken(String token) {
        return jwtUtils.validateJwtToken(token);
    }
    
    public String getUsernameFromToken(String token) {
        return jwtUtils.getUserNameFromJwtToken(token);
    }
}