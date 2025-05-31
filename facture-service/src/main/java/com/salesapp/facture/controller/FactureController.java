package com.salesapp.facture.controller;

import com.salesapp.facture.model.Facture;
import com.salesapp.facture.model.StatutFacture;
import com.salesapp.facture.service.FactureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/factures")
@CrossOrigin(origins = "*")
public class FactureController {

    @Autowired
    private FactureService factureService;

    @GetMapping
    public List<Facture> obtenirToutesLesFactures() {
        return factureService.obtenirToutesLesFactures();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Facture> obtenirFactureParId(@PathVariable Long id) {
        return factureService.obtenirFactureParId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/numero/{numeroFacture}")
    public ResponseEntity<Facture> obtenirFactureParNumero(@PathVariable String numeroFacture) {
        return factureService.obtenirFactureParNumero(numeroFacture)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Facture creerFacture(@RequestBody Facture facture) {
        return factureService.creerFacture(facture);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Facture> mettreAJourFacture(@PathVariable Long id, @RequestBody Facture factureDetails) {
        try {
            Facture factureMiseAJour = factureService.mettreAJourFacture(id, factureDetails);
            return ResponseEntity.ok(factureMiseAJour);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> supprimerFacture(@PathVariable Long id) {
        factureService.supprimerFacture(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/client/{clientId}")
    public List<Facture> obtenirFacturesParClient(@PathVariable Long clientId) {
        return factureService.obtenirFacturesParClient(clientId);
    }

    @GetMapping("/statut/{statut}")
    public List<Facture> obtenirFacturesParStatut(@PathVariable StatutFacture statut) {
        return factureService.obtenirFacturesParStatut(statut);
    }

    @GetMapping("/periode")
    public List<Facture> obtenirFacturesParPeriode(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFin) {
        return factureService.obtenirFacturesParPeriode(dateDebut, dateFin);
    }

    @GetMapping("/retard")
    public List<Facture> obtenirFacturesEnRetard() {
        return factureService.obtenirFacturesEnRetard();
    }

    @GetMapping("/chiffre-affaires")
    public ResponseEntity<Double> calculerChiffreAffaires(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFin) {
        Double chiffre = factureService.calculerChiffreAffaires(dateDebut, dateFin);
        return ResponseEntity.ok(chiffre);
    }

    @PutMapping("/{id}/valider")
    public ResponseEntity<?> validerFacture(@PathVariable Long id) {
        boolean succes = factureService.validerFacture(id);
        return succes ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

    @PutMapping("/{id}/payer")
    public ResponseEntity<?> marquerCommePaye(@PathVariable Long id) {
        boolean succes = factureService.marquerCommePaye(id);
        return succes ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
}