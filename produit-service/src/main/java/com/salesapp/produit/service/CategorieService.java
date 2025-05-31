package com.salesapp.produit.service;

import com.salesapp.produit.model.Categorie;
import com.salesapp.produit.repository.CategorieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategorieService {
    
    @Autowired
    private CategorieRepository categorieRepository;
    
    public List<Categorie> findAll() {
        return categorieRepository.findAll();
    }
    
    public Optional<Categorie> findById(Long id) {
        return categorieRepository.findById(id);
    }
    
    public Categorie save(Categorie categorie) {
        return categorieRepository.save(categorie);
    }
    
    public void deleteById(Long id) {
        categorieRepository.deleteById(id);
    }
    
    public Optional<Categorie> findByNom(String nom) {
        return categorieRepository.findByNom(nom);
    }
}