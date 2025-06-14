package com.salesapp.auth.services;

import com.salesapp.auth.entities.AppRole;
import com.salesapp.auth.entities.AppUser;

import java.util.List;

public interface UserService {
    AppUser addUser(AppUser appUser); // Ajouter un utilisateur
    AppRole addRole(AppRole appRole); // Ajouter un rôle
    void addRoleToUser(String username, String roleName); // Ajouter un rôle à un utilisateur
    AppUser getUserByName(String username); // Récupérer un utilisateur par son nom
    List<AppUser> getAllUsers(); // Récupérer tous les utilisateurs
    AppRole getRoleByName(String roleName);

}
