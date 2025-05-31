export interface Facture {
  id?: number;
  numeroFacture: string;
  clientId: number;
  clientNom?: string;
  dateFacture: Date;
  dateEcheance?: Date;
  montantHT: number;
  montantTVA: number;
  montantTTC: number; // changed from montantTotal for consistency
  tauxTVA: number;
  statut: 'BROUILLON' | 'VALIDEE' | 'ENVOYEE' | 'PAYEE' | 'ANNULEE' | 'EN_RETARD';
  modePaiement?: string;
  observations?: string;
  lignes: LigneFacture[];
  dateCreation?: Date;
  dateModification?: Date;
}

export interface LigneFacture {
  id?: number;
  dispositifId: number;
  nomDispositif: string;
  quantite: number;
  prixUnitaire: number;
  montantLigne: number;
  description?: string;
}
