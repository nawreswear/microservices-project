package com.salesapp.reglement.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reglements")
public class Reglement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_reglement", unique = true, nullable = false)
    private String numeroReglement;

    @Column(name = "facture_id", nullable = false)
    private Long factureId;

    @Column(name = "numero_facture", nullable = false)
    private String numeroFacture;

    @Column(name = "client_id", nullable = false)
    private Long clientId;

    @Column(name = "montant_regle", nullable = false)
    private Double montantRegle;

    @Column(name = "date_reglement", nullable = false)
    private LocalDateTime dateReglement;

    @Enumerated(EnumType.STRING)
    @Column(name = "mode_paiement", nullable = false)
    private ModePaiement modePaiement;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutReglement statut;

    @Column(name = "reference_transaction")
    private String referenceTransaction;

    @Column(name = "numero_cheque")
    private String numeroCheque;

    @Column(name = "banque_emettrice")
    private String banqueEmettrice;

    private String observations;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    @Column(name = "date_modification")
    private LocalDateTime dateModification;

    // Constructeurs
    public Reglement() {}

    public Reglement(Long factureId, String numeroFacture, Long clientId, Double montantRegle, ModePaiement modePaiement) {
        this.factureId = factureId;
        this.numeroFacture = numeroFacture;
        this.clientId = clientId;
        this.montantRegle = montantRegle;
        this.modePaiement = modePaiement;
        this.dateReglement = LocalDateTime.now();
        this.statut = StatutReglement.EN_ATTENTE;
        this.dateCreation = LocalDateTime.now();
        this.numeroReglement = genererNumeroReglement();
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumeroReglement() { return numeroReglement; }
    public void setNumeroReglement(String numeroReglement) { this.numeroReglement = numeroReglement; }

    public Long getFactureId() { return factureId; }
    public void setFactureId(Long factureId) { this.factureId = factureId; }

    public String getNumeroFacture() { return numeroFacture; }
    public void setNumeroFacture(String numeroFacture) { this.numeroFacture = numeroFacture; }

    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }

    public Double getMontantRegle() { return montantRegle; }
    public void setMontantRegle(Double montantRegle) { this.montantRegle = montantRegle; }

    public LocalDateTime getDateReglement() { return dateReglement; }
    public void setDateReglement(LocalDateTime dateReglement) { this.dateReglement = dateReglement; }

    public ModePaiement getModePaiement() { return modePaiement; }
    public void setModePaiement(ModePaiement modePaiement) { this.modePaiement = modePaiement; }

    public StatutReglement getStatut() { return statut; }
    public void setStatut(StatutReglement statut) { this.statut = statut; }

    public String getReferenceTransaction() { return referenceTransaction; }
    public void setReferenceTransaction(String referenceTransaction) { this.referenceTransaction = referenceTransaction; }

    public String getNumeroCheque() { return numeroCheque; }
    public void setNumeroCheque(String numeroCheque) { this.numeroCheque = numeroCheque; }

    public String getBanqueEmettrice() { return banqueEmettrice; }
    public void setBanqueEmettrice(String banqueEmettrice) { this.banqueEmettrice = banqueEmettrice; }

    public String getObservations() { return observations; }
    public void setObservations(String observations) { this.observations = observations; }

    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }

    public LocalDateTime getDateModification() { return dateModification; }
    public void setDateModification(LocalDateTime dateModification) { this.dateModification = dateModification; }

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
        if (numeroReglement == null) {
            numeroReglement = genererNumeroReglement();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        dateModification = LocalDateTime.now();
    }

    private String genererNumeroReglement() {
        LocalDateTime maintenant = LocalDateTime.now();
        return String.format("REG-%04d%02d%02d-%06d",
                maintenant.getYear(),
                maintenant.getMonthValue(),
                maintenant.getDayOfMonth(),
                System.currentTimeMillis() % 1000000);
    }
}
