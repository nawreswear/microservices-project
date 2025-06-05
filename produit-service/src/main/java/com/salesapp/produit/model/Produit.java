package com.salesapp.produit.model;

import javax.persistence.*;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
@Table(name = "produits")
public class Produit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom du produit est obligatoire")
    @Column(nullable = false)
    private String nom;

    private String description;

    @NotNull(message = "Le prix est obligatoire")
    @DecimalMin(value = "0.0", inclusive = false, message = "Le prix doit être positif")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal prix;

    @Min(value = 0, message = "Le stock disponible ne peut pas être négatif")
    @Column(name = "stock_disponible")
    private Integer stockDisponible = 0;

    @Min(value = 0, message = "Le stock minimum ne peut pas être négatif")
    @Column(name = "stock_minimum")
    private Integer stockMinimum = 0;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categorie_id")
    private Categorie categorie;

    private String imageUrl;

    public Produit() {}

    public Produit(String nom, String description, BigDecimal prix, Integer stockDisponible,
                   Integer stockMinimum, Categorie categorie) {
        this.nom = nom;
        this.description = description;
        this.prix = prix;
        this.stockDisponible = stockDisponible;
        this.stockMinimum = stockMinimum;
        this.categorie = categorie;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrix() { return prix; }
    public void setPrix(BigDecimal prix) { this.prix = prix; }

    public Integer getStockDisponible() { return stockDisponible; }
    public void setStockDisponible(Integer stockDisponible) { this.stockDisponible = stockDisponible; }

    public Integer getStockMinimum() { return stockMinimum; }
    public void setStockMinimum(Integer stockMinimum) { this.stockMinimum = stockMinimum; }

    public Categorie getCategorie() { return categorie; }
    public void setCategorie(Categorie categorie) { this.categorie = categorie; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public boolean isEnRuptureDeStock() {
        return stockDisponible <= stockMinimum;
    }
}
