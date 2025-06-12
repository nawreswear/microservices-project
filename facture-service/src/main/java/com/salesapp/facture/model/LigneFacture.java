package com.salesapp.facture.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;

@Entity
@Table(name = "lignes_facture")
public class LigneFacture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "facture_id", nullable = false)
    @JsonBackReference
    private Facture facture;

    @Column(name = "dispositif_id", nullable = false)
    private Long dispositifId;

    @Column(name = "nom_dispositif", nullable = false)
    private String nomDispositif;

    @Column(nullable = false)
    private Integer quantite;

    @Column(name = "prix_unitaire", nullable = false)
    private Double prixUnitaire;

    @Column(name = "montant_ligne", nullable = false)
    private Double montantLigne;

    private String description;

    // Constructeurs
    public LigneFacture() {}

    public LigneFacture(Facture facture, Long dispositifId, String nomDispositif, Integer quantite, Double prixUnitaire) {
        this.facture = facture;
        this.dispositifId = dispositifId;
        this.nomDispositif = nomDispositif;
        this.quantite = quantite;
        this.prixUnitaire = prixUnitaire;
        this.montantLigne = quantite * prixUnitaire;
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Facture getFacture() { return facture; }
    public void setFacture(Facture facture) { this.facture = facture; }

    public Long getDispositifId() { return dispositifId; }
    public void setDispositifId(Long dispositifId) { this.dispositifId = dispositifId; }

    public String getNomDispositif() { return nomDispositif; }
    public void setNomDispositif(String nomDispositif) { this.nomDispositif = nomDispositif; }

    public Integer getQuantite() { return quantite; }
    public void setQuantite(Integer quantite) {
        this.quantite = quantite;
        if (prixUnitaire != null) {
            this.montantLigne = quantite * prixUnitaire;
        }
    }

    public Double getPrixUnitaire() { return prixUnitaire; }
    public void setPrixUnitaire(Double prixUnitaire) {
        this.prixUnitaire = prixUnitaire;
        if (quantite != null) {
            this.montantLigne = quantite * prixUnitaire;
        }
    }

    public Double getMontantLigne() { return montantLigne; }
    public void setMontantLigne(Double montantLigne) { this.montantLigne = montantLigne; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}