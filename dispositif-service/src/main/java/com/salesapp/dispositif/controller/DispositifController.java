package com.salesapp.dispositif.controller;

import com.salesapp.dispositif.model.Dispositif;
import com.salesapp.dispositif.service.DispositifService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dispositifs")
@CrossOrigin(origins = "*")
public class DispositifController {

    @Autowired
    private DispositifService dispositifService;

    @GetMapping
    public List<Dispositif> obtenirTousLesDispositifs() {
        return dispositifService.obtenirTousLesDispositifs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Dispositif> obtenirDispositifParId(@PathVariable Long id) {
        return dispositifService.obtenirDispositifParId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Dispositif creerDispositif(@RequestBody Dispositif dispositif) {
        return dispositifService.creerDispositif(dispositif);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Dispositif> mettreAJourDispositif(@PathVariable Long id, @RequestBody Dispositif dispositifDetails) {
        try {
            Dispositif dispositifMisAJour = dispositifService.mettreAJourDispositif(id, dispositifDetails);
            return ResponseEntity.ok(dispositifMisAJour);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> supprimerDispositif(@PathVariable Long id) {
        dispositifService.supprimerDispositif(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/type/{type}")
    public List<Dispositif> obtenirDispositifsParType(@PathVariable String type) {
        return dispositifService.obtenirDispositifsParType(type);
    }

    @GetMapping("/marque/{marque}")
    public List<Dispositif> obtenirDispositifsParMarque(@PathVariable String marque) {
        return dispositifService.obtenirDispositifsParMarque(marque);
    }

    @GetMapping("/recherche")
    public List<Dispositif> rechercherDispositifs(@RequestParam String terme) {
        return dispositifService.rechercherDispositifs(terme);
    }

    @GetMapping("/rupture-stock")
    public List<Dispositif> obtenirDispositifsEnRupture() {
        return dispositifService.obtenirDispositifsEnRupture();
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<?> mettreAJourStock(@PathVariable Long id, @RequestParam Integer quantite) {
        boolean succes = dispositifService.mettreAJourStock(id, quantite);
        return succes ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
}