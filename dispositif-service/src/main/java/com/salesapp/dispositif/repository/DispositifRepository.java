package com.salesapp.dispositif.repository;

import com.salesapp.dispositif.model.Dispositif;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DispositifRepository extends JpaRepository<Dispositif, Long> {

    List<Dispositif> findByType(String type);

    List<Dispositif> findByMarque(String marque);

    List<Dispositif> findByMarqueAndModele(String marque, String modele);

    Optional<Dispositif> findByNumeroSerie(String numeroSerie);

    @Query("SELECT d FROM Dispositif d WHERE d.quantiteStock <= d.seuilAlerte")
    List<Dispositif> findDispositifsEnRuptureStock();

    @Query("SELECT d FROM Dispositif d WHERE d.nom LIKE %:nom% OR d.marque LIKE %:nom% OR d.modele LIKE %:nom%")
    List<Dispositif> rechercherParNom(@Param("nom") String nom);

    @Query("SELECT d FROM Dispositif d WHERE d.prix BETWEEN :prixMin AND :prixMax")
    List<Dispositif> findByPrixBetween(@Param("prixMin") Double prixMin, @Param("prixMax") Double prixMax);
}