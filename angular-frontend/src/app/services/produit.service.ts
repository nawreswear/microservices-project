import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit, Categorie } from '../models/produit.model';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private apiUrl = 'http://localhost:8082/api/produits';
  private apiUrl2 = 'http://localhost:8082/api/categories';

  constructor(private http: HttpClient) {}

  // -------------------- PRODUIT CRUD --------------------
  getProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.apiUrl);
  }

  getProduit(id: number): Observable<Produit> {
    return this.http.get<Produit>(`${this.apiUrl}/${id}`);
  }

  createProduit(produit: Produit): Observable<Produit> {
    return this.http.post<Produit>(this.apiUrl, produit);
  }

  updateProduit(id: number, produit: Produit): Observable<Produit> {
    return this.http.put<Produit>(`${this.apiUrl}/${id}`, produit);
  }

  deleteProduit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // -------------------- EXTENDED PRODUIT METHODS --------------------

  // Get products by category
  getProduitsByCategorie(categorieId: number): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/categorie/${categorieId}`);
  }

  // Get products with low stock
  getProduitsEnRuptureDeStock(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/rupture-stock`);
  }

  // Search products by name
  searchProduits(nom: string): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/search?nom=${nom}`);
  }

  // Get products by price range
  getProduitsByPrix(min: number, max: number): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/prix?min=${min}&max=${max}`);
  }

  // Update product stock to a specific value
  updateStock(id: number, quantite: number): Observable<Produit> {
    return this.http.put<Produit>(`${this.apiUrl}/${id}/stock?quantite=${quantite}`, null);
  }

  // Reduce product stock by a specific quantity
  reduireStock(id: number, quantite: number): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/${id}/reduire-stock?quantite=${quantite}`, null);
  }

  // -------------------- CATEGORIE CRUD --------------------
  getCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.apiUrl2);
  }

  getCategorie(id: number): Observable<Categorie> {
    return this.http.get<Categorie>(`${this.apiUrl2}/${id}`);
  }

  createCategorie(categorie: Categorie): Observable<Categorie> {
    return this.http.post<Categorie>(this.apiUrl2, categorie);
  }

  updateCategorie(id: number, categorie: Categorie): Observable<Categorie> {
    return this.http.put<Categorie>(`${this.apiUrl2}/${id}`, categorie);
  }

  deleteCategorie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl2}/${id}`);
  }
}
