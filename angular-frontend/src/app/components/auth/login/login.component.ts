import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

export interface LoginRequest {
  username: string;
  password: string;
}

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
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }

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
        // 🔁 Use correct keys: 'access-token' and 'refresh-token'
        const accessToken = response['access-token'];
        const refreshToken = response['refresh-token'];

        if (accessToken && refreshToken) {
          this.authService.saveTokens(accessToken, refreshToken);

          if (this.rememberMe) {
            this.saveCredentials();
          } else {
            this.clearSavedCredentials();
          }

          this.router.navigate(['/dashboard']);
        } else {
          this.error = 'Invalid response from server';
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Login error:', err);
        this.handleLoginError(err);
        this.loading = false;
      }
    });
  }

  validateForm(): boolean {
    if (!this.loginRequest.username.trim()) {
      this.error = 'Username is required';
      return false;
    }

    if (!this.loginRequest.password.trim()) {
      this.error = 'Password is required';
      return false;
    }

    if (this.loginRequest.username.length < 3) {
      this.error = 'Username must be at least 3 characters';
      return false;
    }

    if (this.loginRequest.password.length < 6) {
      this.error = 'Password must be at least 6 characters';
      return false;
    }

    return true;
  }

  handleLoginError(error: any): void {
    if (error.status === 401) {
      this.error = 'Incorrect username or password';
    } else if (error.status === 403) {
      this.error = 'Access denied. Your account may be disabled.';
    } else if (error.status === 0) {
      this.error = 'Cannot connect to server. Please check your internet.';
    } else if (error.error && error.error.message) {
      this.error = error.error.message;
    } else {
      this.error = 'An unexpected error occurred. Please try again.';
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  clearError(): void {
    this.error = '';
  }

  saveCredentials(): void {
    localStorage.setItem('savedUsername', this.loginRequest.username);
    localStorage.setItem('rememberMe', 'true');
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

  loginAsDemo(role: 'admin' | 'user'): void {
    this.loginRequest.username = role === 'admin' ? 'admin' : 'user';
    this.loginRequest.password = role === 'admin' ? 'admin123' : 'user123';
    this.onSubmit();
  }
}
