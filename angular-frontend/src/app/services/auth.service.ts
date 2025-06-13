/*import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AppUser {
  id?: number;
  username: string;
  password: string;
  roles?: { id?: number; roleName: string }[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8085/users';

  constructor(private http: HttpClient) {}

  
  login(credentials: { username: string; password: string }): Observable<{ 'access-token': string, 'refresh-token': string }> {
    return this.http.post<{ 'access-token': string, 'refresh-token': string }>(
      `${this.apiUrl}/login`,
      credentials
    );
  }

 
  getAllUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(this.apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

 
  addUser(user: AppUser): Observable<AppUser> {
    return this.http.post<AppUser>(this.apiUrl, user, {
      headers: this.getAuthHeaders(),
    });
  }

 
  registerUser(user: AppUser): Observable<AppUser> {
    return this.http.post<AppUser>(`${this.apiUrl}/register`, user);
  }

  registerAdmin(user: AppUser): Observable<AppUser> {
    return this.http.post<AppUser>(`${this.apiUrl}/register-admin`, user, {
      headers: this.getAuthHeaders(),
    });
  }

 
  refreshToken(): Observable<{ 'access-token': string, 'refresh-token': string }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getRefreshToken()}`,
    });

    return this.http.get<{ 'access-token': string, 'refresh-token': string }>(
      `${this.apiUrl}/refreshToken`,
      { headers }
    );
  }


  saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access-token', accessToken);
    localStorage.setItem('refresh-token', refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access-token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh-token');
  }

 
  private getAuthHeaders(): HttpHeaders {
    const token = this.getAccessToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }


  logout(): void {
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
  }

 
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}*/
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AppUser {
  id?: number;
  username: string;
  password?: string;
  roles?: { id?: number; roleName: string }[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8085/users';

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<{ 'access-token': string; 'refresh-token': string }> {
    return this.http.post<{ 'access-token': string; 'refresh-token': string }>(`${this.apiUrl}/login`, credentials);
  }

  getAllUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  addUser(user: AppUser): Observable<AppUser> {
    return this.http.post<AppUser>(this.apiUrl, user, { headers: this.getAuthHeaders() });
  }

  registerUser(user: AppUser): Observable<AppUser> {
    return this.http.post<AppUser>(`${this.apiUrl}/register`, user);
  }

  registerAdmin(user: AppUser): Observable<AppUser> {
    return this.http.post<AppUser>(`${this.apiUrl}/register-admin`, user, { headers: this.getAuthHeaders() });
  }

  refreshToken(): Observable<{ 'access-token': string; 'refresh-token': string }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getRefreshToken()}`,
    });
    return this.http.get<{ 'access-token': string; 'refresh-token': string }>(`${this.apiUrl}/refreshToken`, { headers });
  }

  saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access-token', accessToken);
    localStorage.setItem('refresh-token', refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access-token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh-token');
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getAccessToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  logout(): void {
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Méthode pour récupérer les infos de l’utilisateur connecté depuis le token.
   * Ici, on suppose que le token JWT est décodé en JSON et contient le username.
   * Sinon, à adapter selon backend.
   */
  getCurrentUser(): { username: string; roles?: string[] } | null {
    const token = this.getAccessToken();
    if (!token) {
      return null;
    }
    try {
      // Décoder le token (JWT) — partie payload entre les deux points
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
      return {
        username: payload.sub || payload.username,
        roles: payload.roles || [],
      };
    } catch (error) {
      console.error('Erreur décodage token', error);
      return null;
    }
  }
}

