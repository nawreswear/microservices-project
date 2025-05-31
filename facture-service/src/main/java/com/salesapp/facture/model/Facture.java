package com.salesapp.facture.model;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "factures")
public class Facture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_facture", unique = true, nullable = false)
    private String numeroFacture;

    @Column(name = "client_id", nullable = false)
    private Long clientId;

    @Column(name = "date_facture", nullable = false)
    private LocalDateTime dateFacture;

    @Column(name = "date_echeance")
    private LocalDateTime dateEcheance;

    @Column(name = "montant_ht", nullable = false)
    private Double montantHT;

    @Column(name = "montant_tva", nullable = false)
    private Double montantTVA;

    @Column(name = "montant_ttc", nullable = false)
    private Double montantTTC;

    @Column(name = "taux_tva")
    private Double tauxTVA = 20.0; // 20% par défaut

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutFacture statut;

    @Column(name = "mode_paiement")
    private String modePaiement;

    private String observations;

    @OneToMany(mappedBy = "facture", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<LigneFacture> lignes;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    @Column(name = "date_modification")
    private LocalDateTime dateModification;

    // Constructeurs
    public Facture() {}

    public Facture(String numeroFacture, Long clientId) {
        this.numeroFacture = numeroFacture;
        this.clientId = clientId;
        this.dateFacture = LocalDateTime.now();
        this.statut = StatutFacture.BROUILLON;
        this.dateCreation = LocalDateTime.now();
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumeroFacture() { return numeroFacture; }
    public void setNumeroFacture(String numeroFacture) { this.numeroFacture = numeroFacture; }

    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }

    public LocalDateTime getDateFacture() { return dateFacture; }
    public void setDateFacture(LocalDateTime dateFacture) { this.dateFacture = dateFacture; }

    public LocalDateTime getDateEcheance() { return dateEcheance; }
    public void setDateEcheance(LocalDateTime dateEcheance) { this.dateEcheance = dateEcheance; }

    public Double getMontantHT() { return montantHT; }
    public void setMontantHT(Double montantHT) { this.montantHT = montantHT; }

    public Double getMontantTVA() { return montantTVA; }
    public void setMontantTVA(Double montantTVA) { this.montantTVA = montantTVA; }

    public Double getMontantTTC() { return montantTTC; }
    public void setMontantTTC(Double montantTTC) { this.montantTTC = montantTTC; }

    public Double getTauxTVA() { return tauxTVA; }
    public void setTauxTVA(Double tauxTVA) { this.tauxTVA = tauxTVA; }

    public StatutFacture getStatut() { return statut; }
    public void setStatut(StatutFacture statut) { this.statut = statut; }

    public String getModePaiement() { return modePaiement; }
    public void setModePaiement(String modePaiement) { this.modePaiement = modePaiement; }

    public String getObservations() { return observations; }
    public void setObservations(String observations) { this.observations = observations; }

    public List<LigneFacture> getLignes() { return lignes; }
    public void setLignes(List<LigneFacture> lignes) { this.lignes = lignes; }

    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }

    public LocalDateTime getDateModification() { return dateModification; }
    public void setDateModification(LocalDateTime dateModification) { this.dateModification = dateModification; }

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        dateModification = LocalDateTime.now();
    }

    // Méthodes utilitaires
    public void calculerMontants() {
        if (lignes != null) {
            montantHT = lignes.stream()
                    .mapToDouble(ligne -> ligne.getQuantite() * ligne.getPrixUnitaire())
                    .sum();
            montantTVA = montantHT * (tauxTVA / 100);
            montantTTC = montantHT + montantTVA;
        }
    }
}

