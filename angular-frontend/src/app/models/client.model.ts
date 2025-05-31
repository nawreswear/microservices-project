export interface Client {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
  dateNaissance?: Date;
  typeClient: 'PARTICULIER' | 'ENTREPRISE';
  numeroSiret?: string;
  actif: boolean;
  dateCreation?: Date;
  dateModification?: Date;
}
