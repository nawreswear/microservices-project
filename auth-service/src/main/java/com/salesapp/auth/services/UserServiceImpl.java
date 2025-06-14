package com.salesapp.auth.services;

import com.salesapp.auth.entities.AppRole;
import com.salesapp.auth.entities.AppUser;
import com.salesapp.auth.repositories.AppRoleRepository;
import com.salesapp.auth.repositories.AppUserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final AppUserRepository appUserRepository;
    private final AppRoleRepository appRoleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(AppUserRepository appUserRepository,
                           AppRoleRepository appRoleRepository,
                           PasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.appRoleRepository = appRoleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AppUser addUser(AppUser appUser) {
        // Vérifier si l'utilisateur existe déjà
        if (appUserRepository.findByUsername(appUser.getUsername()) != null) {
            throw new RuntimeException("L'utilisateur existe déjà !");
        }

        // Encoder le mot de passe avant de le sauvegarder
        appUser.setPassword(passwordEncoder.encode(appUser.getPassword()));

        return appUserRepository.save(appUser);
    }

    @Override
    public AppRole addRole(AppRole appRole) {
        // Vérifier si le rôle existe déjà
        if (appRoleRepository.findByRoleName(appRole.getRoleName()) != null) {
            throw new RuntimeException("Le rôle existe déjà !");
        }
        return appRoleRepository.save(appRole);
    }

    @Override
    public void addRoleToUser(String username, String roleName) {
        // Récupérer l'utilisateur par son nom
        AppUser user = appUserRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("Utilisateur non trouvé !");
        }

        // Récupérer le rôle par son nom
        AppRole role = appRoleRepository.findByRoleName(roleName);
        if (role == null) {
            throw new RuntimeException("Rôle non trouvé !");
        }

        // Ajouter le rôle à l'utilisateur si ce rôle n'est pas déjà attribué
        if (!user.getRoles().contains(role)) {
            user.getRoles().add(role);
        }
    }

    @Override
    public AppUser getUserByName(String username) {
        return appUserRepository.findByUsername(username);
    }

    @Override
    public List<AppUser> getAllUsers() {
        return appUserRepository.findAll();
    }

    @Override
    public AppRole getRoleByName(String roleName) {
        return appRoleRepository.findByRoleName(roleName);
    }
}
