import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Facture } from '../models/facture.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private apiUrl = 'http://localhost:8383/api/factures';

  constructor(private http: HttpClient) {}

  getFactures(): Observable<Facture[]> {
    return this.http.get<Facture[]>(this.apiUrl);
  }

  getFacture(id: number): Observable<Facture> {
    return this.http.get<Facture>(`${this.apiUrl}/${id}`);
  }

  createFacture(facture: Facture): Observable<Facture> {
    return this.http.post<Facture>(this.apiUrl, facture);
  }

  updateFacture(id: number, facture: Facture): Observable<Facture> {
    return this.http.put<Facture>(`${this.apiUrl}/${id}`, facture);
  }

  deleteFacture(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getFacturesParClient(clientId: number): Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.apiUrl}/client/${clientId}`);
  }

  validerFacture(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/valider`, {});
  }

  marquerCommePaye(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/payer`, {});
  }

  getFacturesEnRetard(): Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.apiUrl}/retard`);
  }
}