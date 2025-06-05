export interface Categorie {
  id?: number;                        // corresponds to Long id
  nom: string;                        // required field (@NotBlank)
  description?: string;              // optional, like in Produit                  // boolean status, matches Java boolean
}
