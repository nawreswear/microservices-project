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
import java.util.Optional;

@RestController
@RequestMapping("/api/factures")
@CrossOrigin(origins = "*")
public class FactureController {

    @Autowired
    private FactureService factureService;

    @GetMapping
    public List<Facture> obtenirToutesLesFactures() {
        return factureService.getAllFactures();  // Correction ici
    }

    @GetMapping("/{id}")
    public ResponseEntity<Facture> obtenirFactureParId(@PathVariable Long id) {
        return factureService.getFactureById(id)  // Correction ici
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/numero/{numeroFacture}")
    public Optional<Facture> obtenirFactureParNumero(@PathVariable String numeroFacture) {
        return factureService.getFactureByNumero(numeroFacture);  // Correction ici
    }

    @PostMapping
    public Facture creerFacture(@RequestBody Facture facture) {
        return factureService.createFacture(facture);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Facture> mettreAJourFacture(@PathVariable Long id, @RequestBody Facture factureDetails) {
        try {
            Facture factureMiseAJour = factureService.updateFacture(id, factureDetails);  // Correction ici
            return ResponseEntity.ok(factureMiseAJour);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> supprimerFacture(@PathVariable Long id) {
        factureService.deleteFacture(id);  // Correction ici
        return ResponseEntity.ok().build();
    }

    @GetMapping("/client/{clientId}")
    public List<Facture> obtenirFacturesParClient(@PathVariable Long clientId) {
        return factureService.getFacturesByClient(clientId);  // Correction ici
    }

    @GetMapping("/statut/{statut}")
    public List<Facture> obtenirFacturesParStatut(@PathVariable StatutFacture statut) {
        return factureService.getFacturesByStatut(statut);  // Correction ici
    }

    @GetMapping("/periode")
    public List<Facture> obtenirFacturesParPeriode(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFin) {
        return factureService.getFacturesByPeriod(dateDebut, dateFin);  // Correction ici
    }

    @GetMapping("/retard")
    public List<Facture> obtenirFacturesEnRetard() {
        return factureService.getOverdueFactures();  // Correction ici
    }

    @GetMapping("/chiffre-affaires")
    public ResponseEntity<Double> calculerChiffreAffaires(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFin) {
        Double chiffre = factureService.getChiffreAffaires(dateDebut, dateFin);  // Correction ici
        return ResponseEntity.ok(chiffre);
    }

    @PutMapping("/{id}/valider")
    public ResponseEntity<?> validerFacture(@PathVariable Long id) {
        boolean succes = factureService.validateFacture(id);  // Correction ici
        return succes ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

    @PutMapping("/{id}/payer")
    public ResponseEntity<?> marquerCommePaye(@PathVariable Long id) {
        boolean succes = factureService.markAsPaid(id);  // Correction ici
        return succes ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }
}
