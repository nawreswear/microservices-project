package com.salesapp.client.repository;

import com.salesapp.client.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    
    Optional<Client> findByEmail(String email);
    
    @Query("SELECT c FROM Client c WHERE c.nom LIKE %:nom% OR c.prenom LIKE %:prenom%")
    List<Client> findByNomOrPrenom(@Param("nom") String nom, @Param("prenom") String prenom);
    
    @Query("SELECT c FROM Client c ORDER BY c.dateCreation DESC")
    List<Client> findAllOrderByDateCreationDesc();
}