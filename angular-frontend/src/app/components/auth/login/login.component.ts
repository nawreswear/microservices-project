import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Rediriger si déjà connecté
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
  
    if (this.loginForm.invalid) {
      return;
    }
  
    this.loading = true;
  
    const loginRequest = {
      username: this.f.username.value,
      password: this.f.password.value
    };
  
    this.authService.login(loginRequest)
      .subscribe({
        next: (data) => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.error = 'Incorrect username or password';
          this.loading = false;
        }
      });
  }
  
}