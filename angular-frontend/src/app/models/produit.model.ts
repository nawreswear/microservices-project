//import { Categorie } from './categorie.model';
export interface Produit {
  id?: number;
  nom: string;
  description: string;
  image_url?: string;
  prix: number;
  stock_disponible: number;
  stock_minimum: number;
  categorie_id: number;
}


export interface Categorie {
  id?: number;
  nom: string;
  description: string;
  actif: boolean;
  dateCreation?: Date;
  dateModification?: Date;
}