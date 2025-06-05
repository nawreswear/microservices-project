// src/app/models/reglement.model.ts

export enum ModePaiement {
  CHEQUE = 'CHEQUE',
  ESPECES = 'ESPECES',
  VIREMENT = 'VIREMENT',
  CARTE = 'CARTE',
  PAYPAL = 'PAYPAL',
  // ajoutez d'autres modes si nécessaires
}

export enum StatutReglement {
  EN_ATTENTE = 'EN_ATTENTE',
  PAYE = 'PAYE',
  PARTIELLEMENT_PAYE = 'PARTIELLEMENT_PAYE',
  ANNULE = 'ANNULE',
  // ajoutez d'autres statuts si définis dans l'énum Java
}

export interface Reglement {
  id?: number;
  numeroReglement: string;
  factureId: number;
  numeroFacture: string;
  clientId: number;
  montantRegle: number;
  dateReglement: string; // Utiliser string pour correspondre à l'API JSON
  modePaiement: ModePaiement;
  statut: StatutReglement;
  referenceTransaction?: string;
  numeroCheque?: string;
}
