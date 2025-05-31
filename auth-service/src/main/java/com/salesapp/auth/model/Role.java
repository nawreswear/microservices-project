package com.salesapp.auth.model;

public enum Role {
    USER("USER"),
    ADMIN("ADMIN");
    
    private String value;
    
    Role(String value) {
        this.value = value;
    }
    
    public String getValue() {
        return value;
    }
}