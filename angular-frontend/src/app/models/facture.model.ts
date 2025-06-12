// ✅ Manually define Omit for TypeScript < 3.5
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

// Enum matching the Java backend exactly
export enum StatutFacture {
  BROUILLON = 'BROUILLON',
  VALIDE = 'VALIDE',      // Not VALIDEE
  ENVOYE = 'ENVOYE',      // Not ENVOYEE
  PAYE = 'PAYE',          // Not PAYEE
  ANNULE = 'ANNULE',      // Not ANNULEE
  EN_RETARD = 'EN_RETARD'
}

// Interface for LigneFacture matching the Java model
export interface LigneFacture {
  id?: number;
  dispositifId: number;     // Long in Java
  nomDispositif: string;
  quantite: number;         // Integer in Java
  prixUnitaire: number;     // Double in Java
  montantLigne: number;     // Double in Java - calculated automatically
  description?: string;
  // Note: no facture reference to avoid circular dependency
}

// Interface for Facture matching the Java model
export interface Facture {
  id?: number;
  numeroFacture: string;
  clientId: number;         // Long in Java
  clientNom?: string;       // Additional display field (not in Java model)

  // Dates as ISO strings to match Java's LocalDateTime
  dateFacture: string;      // LocalDateTime in Java
  dateEcheance?: string;
  dateCreation?: string;
  dateModification?: string;

  // Amounts
  montantHT: number;        // Double in Java, default 0.0
  montantTVA: number;       // Double in Java, default 0.0
  montantTTC: number;       // Double in Java, default 0.0
  tauxTVA: number;          // Double in Java, default 20.0

  // Enum status
  statut: StatutFacture;

  // Optional fields
  modePaiement?: string;
  observations?: string;

  // Relations
  lignes: LigneFacture[];   // List<LigneFacture> in Java
}

// Utility types for API requests
export type CreateFactureRequest = Omit<Facture, 'id' | 'dateCreation' | 'dateModification'>;
export type UpdateFactureRequest = Partial<Omit<Facture, 'id' | 'dateCreation'>>;

// Interface for paginated response (for future use)
export interface FacturePageResponse {
  content: Facture[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
