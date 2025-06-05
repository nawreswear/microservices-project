// src/app/models/dispositif.model.ts

export enum StatutDispositif {
  DISPONIBLE = 'DISPONIBLE',
  EN_RUPTURE = 'EN_RUPTURE',
  INACTIF = 'INACTIF',
  // Ajoutez les autres statuts selon votre enum Java
}

export interface Dispositif {
  id?: number;
  nom: string;
  type: string; // Exemple
}