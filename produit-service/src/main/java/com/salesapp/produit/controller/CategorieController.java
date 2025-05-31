package com.salesapp.produit.controller;

import com.salesapp.produit.model.Categorie;
import com.salesapp.produit.service.CategorieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
@Validated
public class CategorieController {
    
    @Autowired
    private CategorieService categorieService;
    
    @GetMapping
    public ResponseEntity<List<Categorie>> getAllCategories() {
        List<Categorie> categories = categorieService.findAll();
        return ResponseEntity.ok(categories);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Categorie> getCategorieById(@PathVariable Long id) {
        Optional<Categorie> categorie = categorieService.findById(id);
        return categorie.map(ResponseEntity::ok)
                       .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Categorie> createCategorie(@Valid @RequestBody Categorie categorie) {
        // Vérifier si la catégorie existe déjà
        if (categorieService.findByNom(categorie.getNom()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        Categorie savedCategorie = categorieService.save(categorie);
        return ResponseEntity.ok(savedCategorie);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Categorie> updateCategorie(@PathVariable Long id, @Valid @RequestBody Categorie categorieDetails) {
        Optional<Categorie> optionalCategorie = categorieService.findById(id);
        if (optionalCategorie.isPresent()) {
            Categorie categorie = optionalCategorie.get();
            categorie.setNom(categorieDetails.getNom());
            categorie.setDescription(categorieDetails.getDescription());
            return ResponseEntity.ok(categorieService.save(categorie));
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategorie(@PathVariable Long id) {
        if (categorieService.findById(id).isPresent()) {
            categorieService.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}