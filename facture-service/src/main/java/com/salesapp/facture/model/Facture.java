package com.salesapp.facture.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "factures")
public class Facture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_facture", unique = true, nullable = false)
    private String numeroFacture;
    @JsonIgnore
    @Column(name = "client_id", nullable = false)
    private Long clientId;

    @Column(name = "date_facture", nullable = false)
    private LocalDateTime dateFacture;

    @Column(name = "date_echeance")
    private LocalDateTime dateEcheance;

    @Column(name = "montant_ht", nullable = false)
    private Double montantHT = 0.0;

    @Column(name = "montant_tva", nullable = false)
    private Double montantTVA = 0.0;

    @Column(name = "montant_ttc", nullable = false)
    private Double montantTTC = 0.0;

    @Column(name = "taux_tva", nullable = false)
    private Double tauxTVA = 20.0; // 20% par défaut

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutFacture statut;

    @Column(name = "mode_paiement")
    private String modePaiement;

    private String observations;

    @OneToMany(mappedBy = "facture", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<LigneFacture> lignes = new ArrayList<>();

    @Column(name = "date_creation", nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @Column(name = "date_modification")
    private LocalDateTime dateModification;

    // Constructeurs
    public Facture() {
        this.dateFacture = LocalDateTime.now();
        this.statut = StatutFacture.BROUILLON;
    }

    public Facture(String numeroFacture, Long clientId) {
        this();
        this.numeroFacture = numeroFacture;
        this.clientId = clientId;
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

    public void setDateModification(LocalDateTime dateModification) {
        this.dateModification = dateModification;
    }

    public List<LigneFacture> getLignes() { return lignes; }
    public void setLignes(List<LigneFacture> lignes) {
        this.lignes.clear();
        if (lignes != null) {
            this.lignes.addAll(lignes);
            // Assurer la cohérence bidirectionnelle
            this.lignes.forEach(l -> l.setFacture(this));
        }
    }

    public LocalDateTime getDateCreation() { return dateCreation; }
    public LocalDateTime getDateModification() { return dateModification; }

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
        if (dateFacture == null) {
            dateFacture = dateCreation;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        dateModification = LocalDateTime.now();
    }

    // Calcul des montants à partir des lignes de facture
    public void calculerMontants() {
        if (lignes != null && !lignes.isEmpty()) {
            montantHT = lignes.stream()
                    .filter(ligne -> ligne.getQuantite() != null && ligne.getPrixUnitaire() != null)
                    .mapToDouble(ligne -> ligne.getQuantite() * ligne.getPrixUnitaire())
                    .sum();
            montantTVA = montantHT * (tauxTVA / 100);
            montantTTC = montantHT + montantTVA;
        } else {
            montantHT = 0.0;
            montantTVA = 0.0;
            montantTTC = 0.0;
        }
    }

    @Override
    public String toString() {
        return "Facture{" +
                "id=" + id +
                ", numeroFacture='" + numeroFacture + '\'' +
                ", clientId=" + clientId +
                ", dateFacture=" + dateFacture +
                ", montantHT=" + montantHT +
                ", montantTVA=" + montantTVA +
                ", montantTTC=" + montantTTC +
                ", statut=" + statut +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Facture)) return false;
        Facture facture = (Facture) o;
        return Objects.equals(id, facture.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
