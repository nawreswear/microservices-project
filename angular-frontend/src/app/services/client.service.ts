import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = `${environment.apiBaseUrl}/api/clients`;

  constructor(private http: HttpClient) {}

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  getClient(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  updateClient(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, client);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Search clients by 'nom' and 'prenom' parameters
  searchClients(nom: string, prenom: string): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/search?nom=${nom}&prenom=${prenom}`);
  }

  searchClientsByNom(nom: string): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/search?nom=${nom}`);
  }
  // Get total revenue for a client
  getChiffreAffaires(clientId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${clientId}/chiffre-affaires`);
  }

  // Get revenue by year for a client
  getChiffreAffairesParAnnee(clientId: number, annee: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${clientId}/chiffre-affaires/${annee}`);
  }

  // Get remaining amount to pay for a client
  getResteAPayer(clientId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${clientId}/reste-a-payer`);
  }

  // Get loyal clients
  getClientsPlusFideles(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/plus-fideles`);
  }
}
