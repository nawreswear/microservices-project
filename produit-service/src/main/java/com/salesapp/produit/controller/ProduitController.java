package com.salesapp.produit.controller;

import com.salesapp.produit.model.Produit;
import com.salesapp.produit.service.ProduitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/produits")
@CrossOrigin(origins = "*")
@Validated
public class ProduitController {
    
    @Autowired
    private ProduitService produitService;
    
    @GetMapping
    public ResponseEntity<List<Produit>> getAllProduits() {
        List<Produit> produits = produitService.findAll();
        return ResponseEntity.ok(produits);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Produit> getProduitById(@PathVariable Long id) {
        Optional<Produit> produit = produitService.findById(id);
        return produit.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Produit> createProduit(@Valid @RequestBody Produit produit) {
        Produit savedProduit = produitService.save(produit);
        return ResponseEntity.ok(savedProduit);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Produit> updateProduit(@PathVariable Long id, @Valid @RequestBody Produit produitDetails) {
        Optional<Produit> optionalProduit = produitService.findById(id);
        if (optionalProduit.isPresent()) {
            Produit produit = optionalProduit.get();
            produit.setNom(produitDetails.getNom());
            produit.setDescription(produitDetails.getDescription());
            produit.setPrix(produitDetails.getPrix());
            produit.setStockDisponible(produitDetails.getStockDisponible());
            produit.setStockMinimum(produitDetails.getStockMinimum());
            produit.setCategorie(produitDetails.getCategorie());
            produit.setImageUrl(produitDetails.getImageUrl());
            return ResponseEntity.ok(produitService.save(produit));
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduit(@PathVariable Long id) {
        if (produitService.findById(id).isPresent()) {
            produitService.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/categorie/{categorieId}")
    public ResponseEntity<List<Produit>> getProduitsByCategorie(@PathVariable Long categorieId) {
        List<Produit> produits = produitService.findByCategorieId(categorieId);
        return ResponseEntity.ok(produits);
    }
    
    @GetMapping("/rupture-stock")
    public ResponseEntity<List<Produit>> getProduitsEnRuptureDeStock() {
        List<Produit> produits = produitService.findProduitsEnRuptureDeStock();
        return ResponseEntity.ok(produits);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Produit>> searchProduits(@RequestParam String nom) {
        List<Produit> produits = produitService.findByNomContaining(nom);
        return ResponseEntity.ok(produits);
    }
    
    @GetMapping("/prix")
    public ResponseEntity<List<Produit>> getProduitsByPrix(@RequestParam Double min, @RequestParam Double max) {
        List<Produit> produits = produitService.findByPrixBetween(min, max);
        return ResponseEntity.ok(produits);
    }
    
    @PutMapping("/{id}/stock")
    public ResponseEntity<Produit> updateStock(@PathVariable Long id, @RequestParam Integer quantite) {
        try {
            Produit produit = produitService.updateStock(id, quantite);
            return ResponseEntity.ok(produit);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}/reduire-stock")
    public ResponseEntity<Boolean> reduireStock(@PathVariable Long id, @RequestParam Integer quantite) {
        boolean success = produitService.reduireStock(id, quantite);
        return ResponseEntity.ok(success);
    }
}