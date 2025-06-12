import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reglement, ModePaiement, StatutReglement } from '../models/reglement.model';

@Injectable({
  providedIn: 'root'
})
export class ReglementService {
  private apiUrl = 'http://localhost:8007/api/reglements';

  constructor(private http: HttpClient) { }

  // Récupérer tous les règlements
  getAll(): Observable<Reglement[]> {
    return this.http.get<Reglement[]>(this.apiUrl);
  }

  // Récupérer un règlement par ID
  getById(id: number): Observable<Reglement> {
    return this.http.get<Reglement>(`${this.apiUrl}/${id}`);
  }

  // Créer un nouveau règlement
  create(reglement: Reglement): Observable<Reglement> {
    return this.http.post<Reglement>(this.apiUrl, reglement);
  }

  // Mettre à jour un règlement
  update(id: number, reglement: Reglement): Observable<Reglement> {
    return this.http.put<Reglement>(`${this.apiUrl}/${id}`, reglement);
  }

  // Supprimer un règlement
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Récupérer les règlements par facture
  getByFactureId(factureId: number): Observable<Reglement[]> {
    return this.http.get<Reglement[]>(`${this.apiUrl}/facture/${factureId}`);
  }

  // Récupérer les règlements par client
  getByClientId(clientId: number): Observable<Reglement[]> {
    return this.http.get<Reglement[]>(`${this.apiUrl}/client/${clientId}`);
  }

  // Récupérer les règlements par statut
  getByStatut(statut: StatutReglement): Observable<Reglement[]> {
    return this.http.get<Reglement[]>(`${this.apiUrl}/statut/${statut}`);
  }

  // Récupérer les règlements par mode de paiement
  getByModePaiement(mode: ModePaiement): Observable<Reglement[]> {
    return this.http.get<Reglement[]>(`${this.apiUrl}/mode/${mode}`);
  }

  // Récupérer les règlements par période
  getByPeriode(dateDebut: string, dateFin: string): Observable<Reglement[]> {
    return this.http.get<Reglement[]>(`${this.apiUrl}/periode?debut=${dateDebut}&fin=${dateFin}`);
  }
}