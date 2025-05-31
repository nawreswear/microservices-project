export interface Categorie {
  id?: number;
  nom: string;
  description: string;
  actif: boolean;
  dateCreation?: Date;
  dateModification?: Date;
}