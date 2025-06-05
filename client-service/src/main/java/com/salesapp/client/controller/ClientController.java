package com.salesapp.client.controller;

import com.salesapp.client.model.Client;
import com.salesapp.client.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "http://localhost:4200",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
        allowedHeaders = "*")
@Validated
public class ClientController {

    @Autowired
    private ClientService clientService;

    // Get all clients
    @GetMapping
    public ResponseEntity<List<Client>> getAllClients() {
        return ResponseEntity.ok(clientService.findAll());
    }

    // Get client by ID
    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable Long id) {
        Optional<Client> client = clientService.findById(id);
        return client.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create new client
    @PostMapping
    public ResponseEntity<Client> createClient(@Valid @RequestBody Client client) {
        if (clientService.findByEmail(client.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(clientService.save(client));
    }

    // Update client by ID
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

    // Delete client by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClient(@PathVariable Long id) {
        if (clientService.findById(id).isPresent()) {
            clientService.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Get chiffre d'affaires for client
    @GetMapping("/{id}/chiffre-affaires")
    public ResponseEntity<Double> getChiffreAffaires(@PathVariable Long id) {
        return ResponseEntity.ok(clientService.getChiffreAffaires(id));
    }

    // Get chiffre d'affaires for client by year
    @GetMapping("/{id}/chiffre-affaires/{annee}")
    public ResponseEntity<Double> getChiffreAffairesParAnnee(@PathVariable Long id, @PathVariable int annee) {
        return ResponseEntity.ok(clientService.getChiffreAffairesParAnnee(id, annee));
    }

    // Get remaining amount to pay for client
    @GetMapping("/{id}/reste-a-payer")
    public ResponseEntity<Double> getResteAPayer(@PathVariable Long id) {
        return ResponseEntity.ok(clientService.getResteAPayer(id));
    }

    // Get most loyal clients
    @GetMapping("/plus-fideles")
    public ResponseEntity<List<Client>> getClientsPlusFideles() {
        return ResponseEntity.ok(clientService.getClientsPlusFideles());
    }

    // Search clients by name or surname
    @GetMapping("/search")
    public ResponseEntity<List<Client>> searchClients(@RequestParam String nom, @RequestParam String prenom) {
        return ResponseEntity.ok(clientService.findByNomOrPrenom(nom, prenom));
    }
    @GetMapping("/searchNom")
    public ResponseEntity<List<Client>> searchClientsByNom(@RequestParam String nom) {
        return ResponseEntity.ok(clientService.findByNom(nom));
    }
    // Additional endpoints for other repository methods:

    // Find clients created after a specific date
    @GetMapping("/created-after")
    public ResponseEntity<List<Client>> getClientsCreatedAfter(@RequestParam String dateTime) {
        LocalDateTime date;
        try {
            date = LocalDateTime.parse(dateTime);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(clientService.findClientsCreatedAfter(date));
    }

    // Count clients by creation year
    @GetMapping("/count-by-year/{year}")
    public ResponseEntity<Long> countClientsByYear(@PathVariable int year) {
        return ResponseEntity.ok(clientService.countClientsByCreationYear(year));
    }

    // Find client by email or phone (keyword)
    @GetMapping("/search-by-email-or-phone")
    public ResponseEntity<Optional<Client>> findByEmailOrPhone(@RequestParam String keyword) {
        return ResponseEntity.ok(clientService.findByEmailOrPhone(keyword));
    }
}
