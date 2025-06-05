package com.salesapp.client.service;

import com.salesapp.client.model.Client;
import com.salesapp.client.repository.ClientRepository;
import com.salesapp.client.feign.FactureServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private FactureServiceClient factureServiceClient;

    // Basic CRUD operations
    public List<Client> findAll() {
        return clientRepository.findAll();
    }

    public Optional<Client> findById(Long id) {
        return clientRepository.findById(id);
    }

    public Client save(Client client) {
        return clientRepository.save(client);
    }

    public void deleteById(Long id) {
        clientRepository.deleteById(id);
    }

    // Repository custom query methods
    public Optional<Client> findByEmail(String email) {
        return clientRepository.findByEmail(email);
    }

    public List<Client> findByNom(String nom) {
        return clientRepository.findByNom(nom);
    }
    public List<Client> findByNomOrPrenom(String nom , String prenom) {
        return clientRepository.findByNomOrPrenom(nom, prenom);
    }
    public List<Client> findAllOrderByDateCreationDesc() {
        return clientRepository.findAllOrderByDateCreationDesc();
    }

    public long countClientsByCreationYear(int year) {
        return clientRepository.countClientsByCreationYear(year);
    }

    public List<Client> findClientsCreatedAfter(LocalDateTime date) {
        return clientRepository.findClientsCreatedAfter(date);
    }

    public Optional<Client> findByEmailOrPhone(String keyword) {
        return clientRepository.findByEmailOrPhone(keyword);
    }

    // Facture service calls
    public Double getChiffreAffaires(Long clientId) {
        try {
            return factureServiceClient.getChiffreAffairesClient(clientId);
        } catch (Exception e) {
            return 0.0;
        }
    }

    public Double getChiffreAffairesParAnnee(Long clientId, int annee) {
        try {
            return factureServiceClient.getChiffreAffairesClientParAnnee(clientId, annee);
        } catch (Exception e) {
            return 0.0;
        }
    }

    public Double getResteAPayer(Long clientId) {
        try {
            return factureServiceClient.getResteAPayerClient(clientId);
        } catch (Exception e) {
            return 0.0;
        }
    }

    // Example of method for loyal clients - you may want to change implementation
    public List<Client> getClientsPlusFideles() {
        // This is a placeholder, replace with actual logic or call to factureServiceClient if exists
        return clientRepository.findAllOrderByDateCreationDesc();
    }
}
