package com.salesapp.reglement.controller;

import com.salesapp.reglement.model.ModePaiement;
import com.salesapp.reglement.model.Reglement;
import com.salesapp.reglement.model.StatutReglement;
import com.salesapp.reglement.service.ReglementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reglements")
@CrossOrigin(origins = "http://localhost:4200",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
        allowedHeaders = "*")
public class ReglementController {

    @Autowired
    private ReglementService reglementService;

    @GetMapping
    public List<Reglement> obtenirTousLesReglements() {
        return reglementService.obtenirTousLesReglements();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reglement> obtenirReglementParId(@PathVariable Long id) {
        return reglementService.obtenirReglementParId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/numero/{numeroReglement}")
    public ResponseEntity<Reglement> obtenirReglementParNumero(@PathVariable String numeroReglement) {
        return reglementService.obtenirReglementParNumero(numeroReglement)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Reglement creerReglement(@RequestBody Reglement reglement) {
        return reglementService.creerReglement(reglement);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reglement> mettreAJourReglement(@PathVariable Long id, @RequestBody Reglement reglementDetails) {
        try {
            Reglement reglementMisAJour = reglementService.mettreAJourReglement(id, reglementDetails);
            return ResponseEntity.ok(reglementMisAJour);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> supprimerReglement(@PathVariable Long id) {
        reglementService.supprimerReglement(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/facture/{factureId}")
    public List<Reglement> obtenirReglementsParFacture(@PathVariable Long factureId) {
        return reglementService.obtenirReglementsParFacture(factureId);
    }

    @GetMapping("/client/{clientId}")
    public List<Reglement> obtenirReglementsParClient(@PathVariable Long clientId) {
        return reglementService.obtenirReglementsParClient(clientId);
    }

    @GetMapping("/statut/{statut}")
    public List<Reglement> obtenirReglementsParStatut(@PathVariable StatutReglement statut) {
        return reglementService.obtenirReglementsParStatut(statut);
    }

    @GetMapping("/mode-paiement/{modePaiement}")
    public List<Reglement> obtenirReglementsParModePaiement(@PathVariable ModePaiement modePaiement) {
        return reglementService.obtenirReglementsParModePaiement(modePaiement);
    }

    @GetMapping("/periode")
    public List<Reglement> obtenirReglementsParPeriode(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFin) {
        return reglementService.obtenirReglementsParPeriode(dateDebut, dateFin);
    }

    @GetMapping("/montant-periode")
    public ResponseEntity<Double> calculerMontantRegleParPeriode(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFin) {
        Double montant = reglementService.calculerMontantRegleParPeriode(dateDebut, dateFin);
        return ResponseEntity.ok(montant);
    }

    @GetMapping("/montant-facture/{factureId}")
    public ResponseEntity<Double> calculerMontantRegleParFacture(@PathVariable Long factureId) {
        Double montant = reglementService.calculerMontantRegleParFacture(factureId);
        return ResponseEntity.ok(montant);
    }

    @PutMapping("/{id}/valider")
    public ResponseEntity<?> validerReglement(@PathVariable Long id) {
        boolean succes = reglementService.validerReglement(id);
        return succes ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

    @PutMapping("/{id}/rejeter")
    public ResponseEntity<?> rejeterReglement(@PathVariable Long id, @RequestParam String motif) {
        boolean succes = reglementService.rejeterReglement(id, motif);
        return succes ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

    @PutMapping("/{id}/annuler")
    public ResponseEntity<?> annulerReglement(@PathVariable Long id) {
        boolean succes = reglementService.annulerReglement(id);
        return succes ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
}