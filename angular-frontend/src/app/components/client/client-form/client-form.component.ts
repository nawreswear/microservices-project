import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from 'src/app/services/client.service';
import { Client } from 'src/app/models/client.model';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {
  clientForm: FormGroup;
  submitted = false;
  loading = false;
  isEditMode = false;
  clientId: number | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private clientService: ClientService
  ) {
    this.clientForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.pattern(/^(?:\+216|00216)?[2459]\d{7}$/)]],
      adresse: [''],
      dateCreation: [{ value: null, disabled: true }]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.clientId = +idParam;
        this.isEditMode = true;
        this.loadClient(this.clientId);
      }
    });
  }

  loadClient(id: number): void {
    this.clientService.getClient(id).subscribe({
      next: (client: Client) => {
        this.clientForm.patchValue({
          nom: client.nom,
          prenom: client.prenom,
          email: client.email,
          telephone: client.telephone,
          adresse: client.adresse,
          dateCreation: client.dateCreation ? new Date(client.dateCreation) : null
        });
      },
      error: (err) => {
        console.error('Error loading client:', err);
        this.router.navigate(['/clients']);
      }
    });
  }

  get f() {
    return this.clientForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null;

    if (this.clientForm.invalid) {
      Object.values(this.clientForm.controls).forEach(control => control.markAsTouched());
      return;
    }

    this.loading = true;
    const clientData: Client = {
      nom: this.clientForm.value.nom,
      prenom: this.clientForm.value.prenom,
      email: this.clientForm.value.email,
      telephone: this.clientForm.value.telephone || null,
      adresse: this.clientForm.value.adresse || null
    };
    console.log('Sending client data:', clientData);

    const request$ = this.isEditMode && this.clientId
      ? this.clientService.updateClient(this.clientId, { id: this.clientId, ...clientData })
      : this.clientService.createClient(clientData);

    request$.subscribe({
      next: (response: Client) => {
        console.log('Client saved:', response);
        this.loading = false;
        this.router.navigate(['/clients']);
      },
      error: (err) => {
        console.error('Error saving client:', err);
        const errorMsg = err.error && err.error.message ? err.error.message : err.message || 'Server error';
        this.errorMessage = `Failed to save client: ${err.status} - ${errorMsg}`;
        console.log('Error details: status =', err.status, ', error =', err.error);
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/clients']);
  }
}