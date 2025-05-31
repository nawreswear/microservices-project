package com.salesapp.facture.repository;

import com.salesapp.facture.model.Facture;
import com.salesapp.facture.model.StatutFacture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {

    Optional<Facture> findByNumeroFacture(String numeroFacture);

    List<Facture> findByClientId(Long clientId);

    List<Facture> findByStatut(StatutFacture statut);

    @Query("SELECT f FROM Facture f WHERE f.dateFacture BETWEEN :dateDebut AND :dateFin")
    List<Facture> findByDateFactureBetween(@Param("dateDebut") LocalDateTime dateDebut,
                                           @Param("dateFin") LocalDateTime dateFin);

    @Query("SELECT f FROM Facture f WHERE f.dateEcheance < :maintenant AND f.statut = 'ENVOYEE'")
    List<Facture> findFacturesEnRetard(@Param("maintenant") LocalDateTime maintenant);

    @Query("SELECT SUM(f.montantTTC) FROM Facture f WHERE f.statut = 'PAYEE' AND f.dateFacture BETWEEN :dateDebut AND :dateFin")
    Double calculerChiffreAffaires(@Param("dateDebut") LocalDateTime dateDebut,
                                   @Param("dateFin") LocalDateTime dateFin);
}