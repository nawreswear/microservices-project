import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dispositif } from '../models/dispositif.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DispositifService {
  private apiUrl = 'http://localhost:8484/api/dispositifs';

  constructor(private http: HttpClient) {}

  getDispositifs(): Observable<Dispositif[]> {
    return this.http.get<Dispositif[]>(this.apiUrl);
  }

  getDispositif(id: number): Observable<Dispositif> {
    return this.http.get<Dispositif>(`${this.apiUrl}/${id}`);
  }

  createDispositif(dispositif: Dispositif): Observable<Dispositif> {
    return this.http.post<Dispositif>(this.apiUrl, dispositif);
  }

  updateDispositif(id: number, dispositif: Dispositif): Observable<Dispositif> {
    return this.http.put<Dispositif>(`${this.apiUrl}/${id}`, dispositif);
  }

  deleteDispositif(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getDispositifsParType(type: string): Observable<Dispositif[]> {
    return this.http.get<Dispositif[]>(`${this.apiUrl}/type/${type}`);
  }

  getDispositifsEnRupture(): Observable<Dispositif[]> {
    return this.http.get<Dispositif[]>(`${this.apiUrl}/rupture-stock`);
  }

  updateStock(id: number, quantite: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/stock?quantite=${quantite}`, {});
  }
}