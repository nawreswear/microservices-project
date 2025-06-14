package com.salesapp.auth.entities;

import jakarta.persistence.*;

@Entity
public class AppRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String roleName;

    public AppRole() {}

    // Constructeur avec tous les arguments
    public AppRole(Long id, String roleName) {
        this.id = id;
        this.roleName = roleName;
    }
    public AppRole(String roleName) {
        this.roleName = roleName;
    }

    // Getters et Setters (si pas générés automatiquement par IDE)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
}
