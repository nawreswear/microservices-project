package com.salesapp.produit.service;

import com.salesapp.produit.model.Produit;
import com.salesapp.produit.repository.ProduitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProduitService {

    @Autowired
    private ProduitRepository produitRepository;

    public List<Produit> findAll() {
        return produitRepository.findAll();
    }

    public Optional<Produit> findById(Long id) {
        return produitRepository.findById(id);
    }

    public Produit save(Produit produit) {
        return produitRepository.save(produit);
    }

    public void deleteById(Long id) {
        produitRepository.deleteById(id);
    }

    public List<Produit> findByCategorieId(Long categorieId) {
        return produitRepository.findByCategorieId(categorieId);
    }

    public List<Produit> findProduitsEnRuptureDeStock() {
        return produitRepository.findProduitsEnRuptureDeStock();
    }

    public List<Produit> findByNomContaining(String nom) {
        return produitRepository.findByNomContaining(nom);
    }

    public List<Produit> findByPrixBetween(Double prixMin, Double prixMax) {
        return produitRepository.findByPrixBetween(prixMin, prixMax);
    }

    public List<Produit> findAllOrderByStockAsc() {
        return produitRepository.findAllOrderByStockAsc();
    }

    public Produit updateStock(Long produitId, Integer nouvelleQuantite) {
        return produitRepository.findById(produitId).map(produit -> {
            produit.setStockDisponible(nouvelleQuantite);
            return produitRepository.save(produit);
        }).orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'ID: " + produitId));
    }

    public boolean reduireStock(Long produitId, Integer quantite) {
        Optional<Produit> optionalProduit = produitRepository.findById(produitId);
        if (optionalProduit.isPresent()) {
            Produit produit = optionalProduit.get();
            if (produit.getStockDisponible() >= quantite) {
                produit.setStockDisponible(produit.getStockDisponible() - quantite);
                produitRepository.save(produit);
                return true;
            }
        }
        return false;
    }
}

