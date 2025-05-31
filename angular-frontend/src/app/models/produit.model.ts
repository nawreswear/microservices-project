//import { Categorie } from './categorie.model';

export interface Produit {
  id?: number;
  nom: string;
  description: string;
  prix: number;
  categorieId: number;
  categorieName?: string;
  quantiteStock: number;
  seuilAlerte: number;
  marque: string;
  modele: string;
  specifications?: string;
  actif: boolean;
  dateCreation?: Date;
  dateModification?: Date;
}

export interface Categorie {
  id?: number;
  nom: string;
  description: string;
  actif: boolean;
  dateCreation?: Date;
  dateModification?: Date;
}