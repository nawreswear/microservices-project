
package com.salesapp.devise.service;

import com.salesapp.devise.model.Devise;
import com.salesapp.devise.repository.DeviseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeviseService {

    private final DeviseRepository deviseRepository;

    public DeviseService(DeviseRepository deviseRepository) {
        this.deviseRepository = deviseRepository;
    }

    public List<Devise> getAllDevises() {
        return deviseRepository.findAll();
    }

    public Devise saveDevise(Devise devise) {
        return deviseRepository.save(devise);
    }
}
