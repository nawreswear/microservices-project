package com.salesapp.client.repository;

import com.salesapp.client.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    
    Optional<Client> findByEmail(String email);
    
    @Query("SELECT c FROM Client c WHERE c.nom LIKE %:nom%")//OR c.prenom LIKE %:prenom%
    List<Client> findByNom(@Param("nom") String nom);//, @Param("prenom") String prenom
    @Query("SELECT c FROM Client c WHERE c.nom LIKE %:nom% OR c.prenom LIKE %:prenom%")//
    List<Client> findByNomOrPrenom(@Param("nom") String nom , @Param("prenom") String prenom);//,
    @Query("SELECT c FROM Client c ORDER BY c.dateCreation DESC")
    List<Client> findAllOrderByDateCreationDesc();

    // Count clients by creation year (optional for analytics)
    @Query("SELECT COUNT(c) FROM Client c WHERE YEAR(c.dateCreation) = :year")
    long countClientsByCreationYear(@Param("year") int year);

    // Find clients created after a specific date
    @Query("SELECT c FROM Client c WHERE c.dateCreation >= :date")
    List<Client> findClientsCreatedAfter(@Param("date") LocalDateTime date);

    // Optional: Search clients by email or phone
    @Query("SELECT c FROM Client c WHERE c.email = :keyword OR c.telephone = :keyword")
    Optional<Client> findByEmailOrPhone(@Param("keyword") String keyword);

}