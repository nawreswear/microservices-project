export interface JwtResponse {
  token: string;       // le JWT access token
  username: string;
  email?: string;      // optionnel selon backend
  roles: string[];     // roles sous forme de chaîne, ex: ["ROLE_ADMIN", "ROLE_USER"]
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  username: string;
  email?: string;
  roles: string[];
}
