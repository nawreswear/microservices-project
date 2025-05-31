package com.salesapp.reglement.service;

import com.salesapp.reglement.model.ModePaiement;
import com.salesapp.reglement.model.Reglement;
import com.salesapp.reglement.model.StatutReglement;
import com.salesapp.reglement.repository.ReglementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReglementService {

    @Autowired
    private ReglementRepository reglementRepository;

    public List<Reglement> obtenirTousLesReglements() {
        return reglementRepository.findAll();
    }

    public Optional<Reglement> obtenirReglementParId(Long id) {
        return reglementRepository.findById(id);
    }

    public Optional<Reglement> obtenirReglementParNumero(String numeroReglement) {
        return reglementRepository.findByNumeroReglement(numeroReglement);
    }

    public Reglement creerReglement(Reglement reglement) {
        return reglementRepository.save(reglement);
    }

    public Reglement mettreAJourReglement(Long id, Reglement reglementDetails) {
        return reglementRepository.findById(id)
                .map(reglement -> {
                    reglement.setMontantRegle(reglementDetails.getMontantRegle());
                    reglement.setDateReglement(reglementDetails.getDateReglement());
                    reglement.setModePaiement(reglementDetails.getModePaiement());
                    reglement.setStatut(reglementDetails.getStatut());
                    reglement.setReferenceTransaction(reglementDetails.getReferenceTransaction());
                    reglement.setNumeroCheque(reglementDetails.getNumeroCheque());
                    reglement.setBanqueEmettrice(reglementDetails.getBanqueEmettrice());
                    reglement.setObservations(reglementDetails.getObservations());
                    return reglementRepository.save(reglement);
                })
                .orElseThrow(() -> new RuntimeException("Règlement non trouvé avec l'id : " + id));
    }

    public void supprimerReglement(Long id) {
        reglementRepository.deleteById(id);
    }

    public List<Reglement> obtenirReglementsParFacture(Long factureId) {
        return reglementRepository.findByFactureId(factureId);
    }

    public List<Reglement> obtenirReglementsParClient(Long clientId) {
        return reglementRepository.findByClientId(clientId);
    }

    public List<Reglement> obtenirReglementsParStatut(StatutReglement statut) {
        return reglementRepository.findByStatut(statut);
    }

    public List<Reglement> obtenirReglementsParModePaiement(ModePaiement modePaiement) {
        return reglementRepository.findByModePaiement(modePaiement);
    }

    public List<Reglement> obtenirReglementsParPeriode(LocalDateTime dateDebut, LocalDateTime dateFin) {
        return reglementRepository.findByDateReglementBetween(dateDebut, dateFin);
    }

    public Double calculerMontantRegleParPeriode(LocalDateTime dateDebut, LocalDateTime dateFin) {
        Double montant = reglementRepository.calculerMontantRegleParPeriode(dateDebut, dateFin);
        return montant != null ? montant : 0.0;
    }

    public Double calculerMontantRegleParFacture(Long factureId) {
        Double montant = reglementRepository.calculerMontantRegleParFacture(factureId);
        return montant != null ? montant : 0.0;
    }

    public boolean validerReglement(Long reglementId) {
        return reglementRepository.findById(reglementId)
                .map(reglement -> {
                    if (reglement.getStatut() == StatutReglement.EN_ATTENTE) {
                        reglement.setStatut(StatutReglement.VALIDE);
                        reglementRepository.save(reglement);
                        return true;
                    }
                    return false;
                })
                .orElse(false);
    }

    public boolean rejeterReglement(Long reglementId, String motif) {
        return reglementRepository.findById(reglementId)
                .map(reglement -> {
                    if (reglement.getStatut() == StatutReglement.EN_ATTENTE) {
                        reglement.setStatut(StatutReglement.REJETE);
                        reglement.setObservations(motif);
                        reglementRepository.save(reglement);
                        return true;
                    }
                    return false;
                })
                .orElse(false);
    }

    public boolean annulerReglement(Long reglementId) {
        return reglementRepository.findById(reglementId)
                .map(reglement -> {
                    reglement.setStatut(StatutReglement.ANNULE);
                    reglementRepository.save(reglement);
                    return true;
                })
                .orElse(false);
    }
}