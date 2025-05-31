package com.salesapp.client.controller;

import com.salesapp.client.model.Client;
import com.salesapp.client.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "*")
@Validated
public class ClientController {
    
    @Autowired
    private ClientService clientService;
    
    @GetMapping
    public ResponseEntity<List<Client>> getAllClients() {
        List<Client> clients = clientService.findAll();
        return ResponseEntity.ok(clients);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable Long id) {
        Optional<Client> client = clientService.findById(id);
        return client.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Client> createClient(@Valid @RequestBody Client client) {
        // Vérifier si l'email existe déjà
        if (clientService.findByEmail(client.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        Client savedClient = clientService.save(client);
        return ResponseEntity.ok(savedClient);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable Long id, @Valid @RequestBody Client clientDetails) {
        Optional<Client> optionalClient = clientService.findById(id);
        if (optionalClient.isPresent()) {
            Client client = optionalClient.get();
            client.setNom(clientDetails.getNom());
            client.setPrenom(clientDetails.getPrenom());
            client.setEmail(clientDetails.getEmail());
            client.setTelephone(clientDetails.getTelephone());
            client.setAdresse(clientDetails.getAdresse());
            return ResponseEntity.ok(clientService.save(client));
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClient(@PathVariable Long id) {
        if (clientService.findById(id).isPresent()) {
            clientService.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/{id}/chiffre-affaires")
    public ResponseEntity<Double> getChiffreAffaires(@PathVariable Long id) {
        Double chiffre = clientService.getChiffreAffaires(id);
        return ResponseEntity.ok(chiffre);
    }
    
    @GetMapping("/{id}/chiffre-affaires/{annee}")
    public ResponseEntity<Double> getChiffreAffairesParAnnee(@PathVariable Long id, @PathVariable int annee) {
        Double chiffre = clientService.getChiffreAffairesParAnnee(id, annee);
        return ResponseEntity.ok(chiffre);
    }
    
    @GetMapping("/{id}/reste-a-payer")
    public ResponseEntity<Double> getResteAPayer(@PathVariable Long id) {
        Double reste = clientService.getResteAPayer(id);
        return ResponseEntity.ok(reste);
    }
    
    @GetMapping("/plus-fideles")
    public ResponseEntity<List<Client>> getClientsPlusFideles() {
        List<Client> clients = clientService.getClientsPlusFideles();
        return ResponseEntity.ok(clients);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Client>> searchClients(@RequestParam String nom, @RequestParam String prenom) {
        List<Client> clients = clientService.findByNomOrPrenom(nom, prenom);
        return ResponseEntity.ok(clients);
    }
}