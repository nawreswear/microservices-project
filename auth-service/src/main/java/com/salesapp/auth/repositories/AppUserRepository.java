package com.salesapp.auth.repositories;

import com.salesapp.auth.entities.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    AppUser findByUsername(String username);  // Méthode pour trouver un utilisateur par son nom
}
