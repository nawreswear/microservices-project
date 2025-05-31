package com.salesapp.client.service;

import com.salesapp.client.model.Client;
import com.salesapp.client.repository.ClientRepository;
import com.salesapp.client.feign.FactureServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientService {
    
    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private FactureServiceClient factureServiceClient;
    
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
    
    public Optional<Client> findByEmail(String email) {
        return clientRepository.findByEmail(email);
    }
    
    public List<Client> findByNomOrPrenom(String nom, String prenom) {
        return clientRepository.findByNomOrPrenom(nom, prenom);
    }
    
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
    
    public List<Client> getClientsPlusFideles() {
        // Logique pour récupérer les clients les plus fidèles
        // basée sur le chiffre d'affaires ou le nombre de factures
        return clientRepository.findAllOrderByDateCreationDesc();
    }
}