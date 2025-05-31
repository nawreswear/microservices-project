package com.salesapp.dispositif.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "dispositifs")
public class Dispositif {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String type; // ORDINATEUR, SMARTPHONE, TABLETTE, ACCESSOIRE

    @Column(nullable = false)
    private String marque;

    @Column(nullable = false)
    private String modele;

    @Column(name = "numero_serie", unique = true)
    private String numeroSerie;

    @Column(nullable = false)
    private Double prix;

    @Column(name = "quantite_stock")
    private Integer quantiteStock;

    @Column(name = "seuil_alerte")
    private Integer seuilAlerte;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutDispositif statut;

    private String description;

    @Column(name = "specifications", columnDefinition = "TEXT")
    private String specifications;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    @Column(name = "date_modification")
    private LocalDateTime dateModification;

    // Constructeurs
    public Dispositif() {}

    public Dispositif(String nom, String type, String marque, String modele, Double prix) {
        this.nom = nom;
        this.type = type;
        this.marque = marque;
        this.modele = modele;
        this.prix = prix;
        this.statut = StatutDispositif.ACTIF;
        this.dateCreation = LocalDateTime.now();
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getMarque() { return marque; }
    public void setMarque(String marque) { this.marque = marque; }

    public String getModele() { return modele; }
    public void setModele(String modele) { this.modele = modele; }

    public String getNumeroSerie() { return numeroSerie; }
    public void setNumeroSerie(String numeroSerie) { this.numeroSerie = numeroSerie; }

    public Double getPrix() { return prix; }
    public void setPrix(Double prix) { this.prix = prix; }

    public Integer getQuantiteStock() { return quantiteStock; }
    public void setQuantiteStock(Integer quantiteStock) { this.quantiteStock = quantiteStock; }

    public Integer getSeuilAlerte() { return seuilAlerte; }
    public void setSeuilAlerte(Integer seuilAlerte) { this.seuilAlerte = seuilAlerte; }

    public StatutDispositif getStatut() { return statut; }
    public void setStatut(StatutDispositif statut) { this.statut = statut; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSpecifications() { return specifications; }
    public void setSpecifications(String specifications) { this.specifications = specifications; }

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
}

enum StatutDispositif {
    ACTIF, INACTIF, DISCONTINUE, RUPTURE_STOCK
}