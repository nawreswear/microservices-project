package com.salesapp.dispositif.service;

import com.salesapp.dispositif.model.Dispositif;
import com.salesapp.dispositif.repository.DispositifRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DispositifService {

    @Autowired
    private DispositifRepository dispositifRepository;

    public List<Dispositif> obtenirTousLesDispositifs() {
        return dispositifRepository.findAll();
    }

    public Optional<Dispositif> obtenirDispositifParId(Long id) {
        return dispositifRepository.findById(id);
    }

    public Dispositif creerDispositif(Dispositif dispositif) {
        return dispositifRepository.save(dispositif);
    }

    public Dispositif mettreAJourDispositif(Long id, Dispositif dispositifDetails) {
        return dispositifRepository.findById(id)
                .map(dispositif -> {
                    dispositif.setNom(dispositifDetails.getNom());
                    dispositif.setType(dispositifDetails.getType());
                    dispositif.setMarque(dispositifDetails.getMarque());
                    dispositif.setModele(dispositifDetails.getModele());
                    dispositif.setNumeroSerie(dispositifDetails.getNumeroSerie());
                    dispositif.setPrix(dispositifDetails.getPrix());
                    dispositif.setQuantiteStock(dispositifDetails.getQuantiteStock());
                    dispositif.setSeuilAlerte(dispositifDetails.getSeuilAlerte());
                    dispositif.setStatut(dispositifDetails.getStatut());
                    dispositif.setDescription(dispositifDetails.getDescription());
                    dispositif.setSpecifications(dispositifDetails.getSpecifications());
                    return dispositifRepository.save(dispositif);
                })
                .orElseThrow(() -> new RuntimeException("Dispositif non trouvé avec l'id : " + id));
    }

    public void supprimerDispositif(Long id) {
        dispositifRepository.deleteById(id);
    }

    public List<Dispositif> obtenirDispositifsParType(String type) {
        return dispositifRepository.findByType(type);
    }

    public List<Dispositif> obtenirDispositifsParMarque(String marque) {
        return dispositifRepository.findByMarque(marque);
    }

    public List<Dispositif> rechercherDispositifs(String terme) {
        return dispositifRepository.rechercherParNom(terme);
    }

    public List<Dispositif> obtenirDispositifsEnRupture() {
        return dispositifRepository.findDispositifsEnRuptureStock();
    }

    public boolean mettreAJourStock(Long dispositifId, Integer nouvelleQuantite) {
        return dispositifRepository.findById(dispositifId)
                .map(dispositif -> {
                    dispositif.setQuantiteStock(nouvelleQuantite);
                    dispositifRepository.save(dispositif);
                    return true;
                })
                .orElse(false);
    }
}