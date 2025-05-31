package com.salesapp.facture.service;

import com.salesapp.facture.model.Facture;
import com.salesapp.facture.model.StatutFacture;
import com.salesapp.facture.repository.FactureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FactureService {

    @Autowired
    private FactureRepository factureRepository;

    public List<Facture> obtenirToutesLesFactures() {
        return factureRepository.findAll();
    }

    public Optional<Facture> obtenirFactureParId(Long id) {
        return factureRepository.findById(id);
    }

    public Optional<Facture> obtenirFactureParNumero(String numeroFacture) {
        return factureRepository.findByNumeroFacture(numeroFacture);
    }

    public Facture creerFacture(Facture facture) {
        // Générer un numéro de facture unique si non fourni
        if (facture.getNumeroFacture() == null || facture.getNumeroFacture().isEmpty()) {
            facture.setNumeroFacture(genererNumeroFacture());
        }

        // Calculer les montants
        facture.calculerMontants();

        return factureRepository.save(facture);
    }

    public Facture mettreAJourFacture(Long id, Facture factureDetails) {
        return factureRepository.findById(id)
                .map(facture -> {
                    facture.setClientId(factureDetails.getClientId());
                    facture.setDateFacture(factureDetails.getDateFacture());
                    facture.setDateEcheance(factureDetails.getDateEcheance());
                    facture.setStatut(factureDetails.getStatut());
                    facture.setModePaiement(factureDetails.getModePaiement());
                    facture.setObservations(factureDetails.getObservations());
                    facture.setTauxTVA(factureDetails.getTauxTVA());
                    facture.setLignes(factureDetails.getLignes());

                    // Recalculer les montants
                    facture.calculerMontants();

                    return factureRepository.save(facture);
                })
                .orElseThrow(() -> new RuntimeException("Facture non trouvée avec l'id : " + id));
    }

    public void supprimerFacture(Long id) {
        factureRepository.deleteById(id);
    }

    public List<Facture> obtenirFacturesParClient(Long clientId) {
        return factureRepository.findByClientId(clientId);
    }

    public List<Facture> obtenirFacturesParStatut(StatutFacture statut) {
        return factureRepository.findByStatut(statut);
    }

    public List<Facture> obtenirFacturesParPeriode(LocalDateTime dateDebut, LocalDateTime dateFin) {
        return factureRepository.findByDateFactureBetween(dateDebut, dateFin);
    }

    public List<Facture> obtenirFacturesEnRetard() {
        return factureRepository.findFacturesEnRetard(LocalDateTime.now());
    }

    public Double calculerChiffreAffaires(LocalDateTime dateDebut, LocalDateTime dateFin) {
        Double chiffre = factureRepository.calculerChiffreAffaires(dateDebut, dateFin);
        return chiffre != null ? chiffre : 0.0;
    }

    public boolean validerFacture(Long factureId) {
        return factureRepository.findById(factureId)
                .map(facture -> {
                    if (facture.getStatut() == StatutFacture.BROUILLON) {
                        facture.setStatut(StatutFacture.VALIDEE);
                        factureRepository.save(facture);
                        return true;
                    }
                    return false;
                })
                .orElse(false);
    }

    public boolean marquerCommePaye(Long factureId) {
        return factureRepository.findById(factureId)
                .map(facture -> {
                    facture.setStatut(StatutFacture.PAYEE);
                    factureRepository.save(facture);
                    return true;
                })
                .orElse(false);
    }

    private String genererNumeroFacture() {
        // Format: FAC-YYYYMMDD-XXXX
        LocalDateTime maintenant = LocalDateTime.now();
        String dateStr = String.format("%04d%02d%02d",
                maintenant.getYear(),
                maintenant.getMonthValue(),
                maintenant.getDayOfMonth());

        long count = factureRepository.count() + 1;
        return String.format("FAC-%s-%04d", dateStr, count);
    }
}