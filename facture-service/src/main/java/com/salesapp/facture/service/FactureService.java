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

    public List<Facture> getAllFactures() {
        return factureRepository.findAll();
    }

    public Optional<Facture> getFactureById(Long id) {
        return factureRepository.findById(id);
    }

    public Optional<Facture> getFactureByNumero(String numeroFacture) {
        return factureRepository.findByNumeroFacture(numeroFacture);
    }

    public Facture createFacture(Facture facture) {
        if(facture.getMontantHT() == null) {
            throw new IllegalArgumentException("Le montantHT est obligatoire");
        }
        return factureRepository.save(facture);
    }

    public Facture updateFacture(Long id, Facture updatedFacture) {
        return factureRepository.findById(id)
                .map(facture -> {
                    facture.setClientId(updatedFacture.getClientId());
                    facture.setDateFacture(updatedFacture.getDateFacture());
                    facture.setDateEcheance(updatedFacture.getDateEcheance());
                    facture.setStatut(updatedFacture.getStatut());
                    facture.setModePaiement(updatedFacture.getModePaiement());
                    facture.setObservations(updatedFacture.getObservations());
                    facture.setTauxTVA(updatedFacture.getTauxTVA());
                    facture.setLignes(updatedFacture.getLignes());
                    facture.calculerMontants();
                    return factureRepository.save(facture);
                })
                .orElseThrow(() -> new RuntimeException("Facture not found with ID: " + id));
    }

    public void deleteFacture(Long id) {
        factureRepository.deleteById(id);
    }

    public List<Facture> getFacturesByClient(Long clientId) {
        return factureRepository.findByClientId(clientId);
    }

    public List<Facture> getFacturesByStatut(StatutFacture statut) {
        return factureRepository.findByStatut(statut);
    }

    public List<Facture> getFacturesByPeriod(LocalDateTime start, LocalDateTime end) {
        return factureRepository.findByDateFactureBetween(start, end);
    }

    public List<Facture> getOverdueFactures() {
        return factureRepository.findFacturesEnRetard(LocalDateTime.now());
    }

    public Double getChiffreAffaires(LocalDateTime start, LocalDateTime end) {
        Double result = factureRepository.calculerChiffreAffaires(start, end);
        return result != null ? result : 0.0;
    }

    public boolean validateFacture(Long id) {
        return factureRepository.findById(id)
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

    public boolean markAsPaid(Long id) {
        return factureRepository.findById(id)
                .map(facture -> {
                    facture.setStatut(StatutFacture.PAYEE);
                    factureRepository.save(facture);
                    return true;
                })
                .orElse(false);
    }

    private String generateNumeroFacture() {
        LocalDateTime now = LocalDateTime.now();
        String dateStr = String.format("%04d%02d%02d",
                now.getYear(), now.getMonthValue(), now.getDayOfMonth());
        long count = factureRepository.count() + 1;
        return String.format("FAC-%s-%04d", dateStr, count);
    }
}
