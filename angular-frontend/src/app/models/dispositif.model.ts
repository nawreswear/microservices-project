export interface Dispositif {
  id?: number;
  nom: string;
  type: string;
  marque: string;
  modele: string;
  numeroSerie?: string;
  prix: number;
  quantiteStock: number;
  seuilAlerte: number;
  statut: 'ACTIF' | 'INACTIF' | 'DISCONTINUE' | 'RUPTURE_STOCK';
  description?: string;
  specifications?: string;
  dateCreation?: Date;
  dateModification?: Date;
}