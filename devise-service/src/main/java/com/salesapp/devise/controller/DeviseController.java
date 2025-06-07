
package com.salesapp.devise.controller;

import com.salesapp.devise.model.Devise;
import com.salesapp.devise.service.DeviseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devises")
public class DeviseController {

    private final DeviseService deviseService;

    public DeviseController(DeviseService deviseService) {
        this.deviseService = deviseService;
    }

    @GetMapping
    public List<Devise> getAll() {
        return deviseService.getAllDevises();
    }

    @PostMapping
    public Devise create(@RequestBody Devise devise) {
        return deviseService.saveDevise(devise);
    }
}
