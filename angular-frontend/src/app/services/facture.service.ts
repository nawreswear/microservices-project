import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Facture } from '../models/facture.model';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private apiUrl = 'http://localhost:8383/api/factures';
  constructor(private http: HttpClient) {}

  // Get all invoices
  getFactures(): Observable<Facture[]> {
    return this.http.get<Facture[]>(this.apiUrl);
  }

  // Get invoice by ID
  getFacture(id: number): Observable<Facture> {
    return this.http.get<Facture>(`${this.apiUrl}/${id}`);
  }

  // Create a new invoice
  createFacture(facture: Facture): Observable<Facture> {
    return this.http.post<Facture>(this.apiUrl, facture);
  }

  // Update an existing invoice
  updateFacture(id: number, facture: Facture): Observable<Facture> {
    return this.http.put<Facture>(`${this.apiUrl}/${id}`, facture);
  }

  // Delete an invoice
  deleteFacture(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get invoices for a specific client
  getFacturesParClient(clientId: number): Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.apiUrl}/client/${clientId}`);
  }

  // Mark invoice as validated
  validerFacture(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/valider`, {});
  }

  // Mark invoice as paid
  marquerCommePaye(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/payer`, {});
  }

  // Get overdue invoices
  getFacturesEnRetard(): Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.apiUrl}/retard`);
  }
}
