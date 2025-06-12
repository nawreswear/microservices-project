// Enum correspondant exactement au backend Java
export enum StatutFacture {
  BROUILLON = 'BROUILLON',
  VALIDE = 'VALIDE',      // Pas VALIDEE
  ENVOYE = 'ENVOYE',      // Pas ENVOYEE
  PAYE = 'PAYE',          // Pas PAYEE
  ANNULE = 'ANNULE',      // Pas ANNULEE
  EN_RETARD = 'EN_RETARD'
}

// Interface pour LigneFacture correspondant au modèle Java
export interface LigneFacture {
  id?: number;
  dispositifId: number;    // Long en Java
  nomDispositif: string;
  quantite: number;        // Integer en Java
  prixUnitaire: number;    // Double en Java
  montantLigne: number;    // Double en Java - calculé automatiquement
  description?: string;
  // Note: facture n'est pas incluse pour éviter les références circulaires
}

// Interface pour Facture correspondant au modèle Java
export interface Facture {
  id?: number;
  numeroFacture: string;
  clientId: number;        // Long en Java
  clientNom?: string;      // Champ supplémentaire pour l'affichage (pas dans le modèle Java)
  
  // Dates au format ISO string pour compatibilité avec LocalDateTime
  dateFacture: string;     // LocalDateTime en Java
  dateEcheance?: string;   // LocalDateTime en Java
  dateCreation?: string;   // LocalDateTime en Java
  dateModification?: string; // LocalDateTime en Java
  
  // Montants
  montantHT: number;       // Double en Java, valeur par défaut 0.0
  montantTVA: number;      // Double en Java, valeur par défaut 0.0
  montantTTC: number;      // Double en Java, valeur par défaut 0.0
  tauxTVA: number;         // Double en Java, valeur par défaut 20.0
  
  // Statut utilisant l'enum
  statut: StatutFacture;
  
  // Champs optionnels
  modePaiement?: string;
  observations?: string;
  
  // Relations
  lignes: LigneFacture[];  // List<LigneFacture> en Java
}

// Types utilitaires pour les requêtes
export type CreateFactureRequest = Omit<Facture, 'id' | 'dateCreation' | 'dateModification'>;
export type UpdateFactureRequest = Partial<Omit<Facture, 'id' | 'dateCreation'>>;

// Interface pour les réponses avec pagination (si nécessaire plus tard)
export interface FacturePageResponse {
  content: Facture[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}