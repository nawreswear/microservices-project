package com.salesapp.auth.dto;

import com.salesapp.auth.model.Role;
import java.util.Set;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String username;
    private String email;
    private Set<Role> roles;
    
    public JwtResponse(String token, String username, String email, Set<Role> roles) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.roles = roles;
    }
    
    // Getters et Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public Set<Role> getRoles() { return roles; }
    public void setRoles(Set<Role> roles) { this.roles = roles; }
}