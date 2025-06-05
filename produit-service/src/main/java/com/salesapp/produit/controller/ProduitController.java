package com.salesapp.produit.controller;

import com.salesapp.produit.model.Produit;
import com.salesapp.produit.service.ProduitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
        return ResponseEntity.ok(produitService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produit> getProduitById(@PathVariable Long id) {
        return produitService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Produit> createProduit(@Valid @RequestBody Produit produit) {
        Produit savedProduit = produitService.save(produit);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduit);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produit> updateProduit(@PathVariable Long id, @Valid @RequestBody Produit produitDetails) {
        Optional<Produit> optionalProduit = produitService.findById(id);
        if (optionalProduit.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Produit produit = optionalProduit.get();
        produit.setNom(produitDetails.getNom());
        produit.setDescription(produitDetails.getDescription());
        produit.setPrix(produitDetails.getPrix());
        produit.setStockDisponible(produitDetails.getStockDisponible());
        produit.setStockMinimum(produitDetails.getStockMinimum());
        produit.setCategorie(produitDetails.getCategorie());
        produit.setImageUrl(produitDetails.getImageUrl());

        Produit updated = produitService.save(produit);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduit(@PathVariable Long id) {
        if (produitService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        produitService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/categorie/{categorieId}")
    public ResponseEntity<List<Produit>> getProduitsByCategorie(@PathVariable Long categorieId) {
        return ResponseEntity.ok(produitService.findByCategorieId(categorieId));
    }

    @GetMapping("/rupture-stock")
    public ResponseEntity<List<Produit>> getProduitsEnRuptureDeStock() {
        return ResponseEntity.ok(produitService.findProduitsEnRuptureDeStock());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Produit>> searchProduitsByNom(@RequestParam String nom) {
        return ResponseEntity.ok(produitService.findByNomContaining(nom));
    }

    @GetMapping("/prix-range")
    public ResponseEntity<List<Produit>> getProduitsByPrixRange(
            @RequestParam(name = "min") Double min,
            @RequestParam(name = "max") Double max) {
        return ResponseEntity.ok(produitService.findByPrixBetween(min, max));
    }

    @GetMapping("/stock-asc")
    public ResponseEntity<List<Produit>> getProduitsOrderByStockAsc() {
        return ResponseEntity.ok(produitService.findAllOrderByStockAsc());
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<Produit> updateStock(
            @PathVariable Long id,
            @RequestParam(name = "quantite") Integer quantite) {
        try {
            Produit updatedProduit = produitService.updateStock(id, quantite);
            return ResponseEntity.ok(updatedProduit);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/{id}/reduire-stock")
    public ResponseEntity<Boolean> reduireStock(
            @PathVariable Long id,
            @RequestParam(name = "quantite") Integer quantite) {
        boolean result = produitService.reduireStock(id, quantite);
        return ResponseEntity.ok(result);
    }
}
