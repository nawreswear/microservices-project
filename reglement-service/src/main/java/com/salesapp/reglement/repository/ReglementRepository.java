package com.salesapp.reglement.repository;

import com.salesapp.reglement.model.ModePaiement;
import com.salesapp.reglement.model.Reglement;
import com.salesapp.reglement.model.StatutReglement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReglementRepository extends JpaRepository<Reglement, Long> {

    Optional<Reglement> findByNumeroReglement(String numeroReglement);

    List<Reglement> findByFactureId(Long factureId);

    List<Reglement> findByClientId(Long clientId);

    List<Reglement> findByStatut(StatutReglement statut);

    List<Reglement> findByModePaiement(ModePaiement modePaiement);

    @Query("SELECT r FROM Reglement r WHERE r.dateReglement BETWEEN :dateDebut AND :dateFin")
    List<Reglement> findByDateReglementBetween(@Param("dateDebut") LocalDateTime dateDebut,
                                               @Param("dateFin") LocalDateTime dateFin);

    @Query("SELECT SUM(r.montantRegle) FROM Reglement r WHERE r.statut = 'VALIDE' AND r.dateReglement BETWEEN :dateDebut AND :dateFin")
    Double calculerMontantRegleParPeriode(@Param("dateDebut") LocalDateTime dateDebut,
                                          @Param("dateFin") LocalDateTime dateFin);

    @Query("SELECT SUM(r.montantRegle) FROM Reglement r WHERE r.factureId = :factureId AND r.statut = 'VALIDE'")
    Double calculerMontantRegleParFacture(@Param("factureId") Long factureId);

    List<Reglement> findByReferenceTransaction(String referenceTransaction);
}