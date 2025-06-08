import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Devise } from '../models/devise.model';

@Injectable({
  providedIn: 'root'
})
export class DeviseService {
  private apiUrl = 'http://localhost:8087/api/devises';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Devise[]> {
    return this.http.get<Devise[]>(this.apiUrl);
  }

  create(devise: Devise): Observable<Devise> {
    return this.http.post<Devise>(this.apiUrl, devise);
  }
}