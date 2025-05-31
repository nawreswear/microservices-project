
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  //styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent implements OnInit {
  clientForm: FormGroup;
  submitted = false;
  loading = false;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.clientForm = this.fb.group({
      typeClient: ['PARTICULIER', Validators.required],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/)]],
      dateNaissance: [''],
      adresse: ['', Validators.required],
      ville: ['', Validators.required],
      codePostal: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      pays: ['France', Validators.required],
      numeroSiret: [''],
      actif: [true]
    });
  }

  ngOnInit(): void {
    const typeClientControl = this.clientForm.get('typeClient');
    if (typeClientControl) {
      typeClientControl.valueChanges.subscribe(type => {
        const siretControl = this.clientForm.get('numeroSiret');
        if (type === 'ENTREPRISE') {
          if (siretControl) {
            siretControl.setValidators([Validators.required, Validators.pattern(/^[0-9]{14}$/)]);
          }
        } else {
          if (siretControl) {
            siretControl.clearValidators();
          }
        }
        if (siretControl) {
          siretControl.updateValueAndValidity();
        }
      });
    }
  }

  get f() {
    return this.clientForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.clientForm.valid) {
      this.loading = true;
      
      // Simulation d'un appel API
      setTimeout(() => {
        console.log('Client data:', this.clientForm.value);
        this.loading = false;
        this.router.navigate(['/clients']);
      }, 2000);
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.clientForm.controls).forEach(key => {
        const control = this.clientForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/clients']);
  }
}