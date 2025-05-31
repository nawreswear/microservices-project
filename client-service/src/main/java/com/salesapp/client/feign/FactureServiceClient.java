package com.salesapp.client.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "facture-service")
public interface FactureServiceClient {
    
    @GetMapping("/api/factures/client/{clientId}/chiffre-affaires")
    Double getChiffreAffairesClient(@PathVariable Long clientId);
    
    @GetMapping("/api/factures/client/{clientId}/chiffre-affaires/{annee}")
    Double getChiffreAffairesClientParAnnee(@PathVariable Long clientId, @PathVariable int annee);
    
    @GetMapping("/api/factures/client/{clientId}/reste-a-payer")
    Double getResteAPayerClient(@PathVariable Long clientId);
}