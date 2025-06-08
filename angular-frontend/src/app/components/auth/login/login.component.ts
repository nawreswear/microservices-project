import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../models/auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginRequest: LoginRequest = {
    username: '',
    password: ''
  };

  loading = false;
  error = '';
  showPassword = false;
  rememberMe = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Rediriger si déjà connecté
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }

    // Charger les données sauvegardées si "Se souvenir de moi" était coché
    this.loadSavedCredentials();
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.loginRequest).subscribe({
      next: (response) => {
        console.log('Connexion réussie:', response);
        
        // Sauvegarder les identifiants si "Se souvenir de moi" est coché
        if (this.rememberMe) {
          this.saveCredentials();
        } else {
          this.clearSavedCredentials();
        }

        // Rediriger vers le dashboard
        this.router.navigate(['/dashboard']);
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur de connexion:', err);
        this.handleLoginError(err);
        this.loading = false;
      }
    });
  }

  validateForm(): boolean {
    if (!this.loginRequest.username || this.loginRequest.username.trim() === '') {
      this.error = 'Le nom d\'utilisateur est obligatoire';
      return false;
    }

    if (!this.loginRequest.password || this.loginRequest.password.trim() === '') {
      this.error = 'Le mot de passe est obligatoire';
      return false;
    }

    if (this.loginRequest.username.length < 3) {
      this.error = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
      return false;
    }

    if (this.loginRequest.password.length < 6) {
      this.error = 'Le mot de passe doit contenir au moins 6 caractères';
      return false;
    }

    return true;
  }

  handleLoginError(error: any): void {
    if (error.status === 401) {
      this.error = 'Nom d\'utilisateur ou mot de passe incorrect';
    } else if (error.status === 403) {
      this.error = 'Accès refusé. Votre compte peut être désactivé.';
    } else if (error.status === 0) {
      this.error = 'Impossible de se connecter au serveur. Vérifiez votre connexion.';
    } else if (error.error && error.error.message) {
      this.error = error.error.message;
    } else {
      this.error = 'Une erreur inattendue s\'est produite. Veuillez réessayer.';
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  clearError(): void {
    this.error = '';
  }

  saveCredentials(): void {
    if (this.rememberMe) {
      localStorage.setItem('savedUsername', this.loginRequest.username);
      localStorage.setItem('rememberMe', 'true');
    }
  }

  loadSavedCredentials(): void {
    const savedUsername = localStorage.getItem('savedUsername');
    const rememberMe = localStorage.getItem('rememberMe');
    
    if (savedUsername && rememberMe === 'true') {
      this.loginRequest.username = savedUsername;
      this.rememberMe = true;
    }
  }

  clearSavedCredentials(): void {
    localStorage.removeItem('savedUsername');
    localStorage.removeItem('rememberMe');
  }

  onUsernameChange(): void {
    this.clearError();
  }

  onPasswordChange(): void {
    this.clearError();
  }

  // Méthode pour les utilisateurs de démonstration
  loginAsDemo(role: 'admin' | 'user'): void {
    if (role === 'admin') {
      this.loginRequest.username = 'admin';
      this.loginRequest.password = 'admin123';
    } else {
      this.loginRequest.username = 'user';
      this.loginRequest.password = 'user123';
    }
    this.onSubmit();
  }
}