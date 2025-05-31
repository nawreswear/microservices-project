export interface Reglement {
  id?: number;
  numeroReglement: string;
  factureId: number;
  numeroFacture: string;
  clientId: number;
  montantRegle: number;
  dateReglement: Date;
  modePaiement: 'ESPECES' | 'CHEQUE' | 'VIREMENT' | 'CARTE_BANCAIRE' | 'PRELEVEMENT' | 'PAYPAL' | 'CRYPTO';
  statut: 'EN_ATTENTE' | 'VALIDE' | 'REJETE' | 'ANNULE' | 'REMBOURSE';
  referenceTransaction?: string;
  numeroCheque?: string;
  banqueEmettrice?: string;
  observations?: string;
  dateCreation?: Date;
  dateModification?: Date;
}