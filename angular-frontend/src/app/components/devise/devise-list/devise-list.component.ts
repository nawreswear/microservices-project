import { Component, OnInit } from '@angular/core';
import { DeviseService } from '../../../services/devise.service';
import { Devise } from '../../../models/devise.model';

@Component({
  selector: 'app-devise-list',
  templateUrl: './devise-list.component.html',
  styleUrls: ['./devise-list.component.css']
})
export class DeviseListComponent implements OnInit {
  devises: Devise[] = [];
  newDevise: Devise = {
    id: 0, // Default or temporary ID; actual value usually set by backend
    code: '',
    name: '',
    exchangeRate: 0
  };
  loading = false;
  error = '';
  success = '';

  constructor(private deviseService: DeviseService) {}

  ngOnInit() {
    this.loadDevises();
  }

  loadDevises() {
    this.loading = true;
    this.deviseService.getAll().subscribe({
      next: (data) => {
        this.devises = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading currencies';
        console.error(err);
        this.loading = false;
      }
    });
  }

  createDevise() {
    if (!this.validateDevise()) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.deviseService.create(this.newDevise).subscribe({
      next: (devise) => {
        this.devises.push(devise);
        this.resetForm();
        this.success = 'Currency added successfully';
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error creating currency';
        console.error(err);
        this.loading = false;
      }
    });
  }

  validateDevise(): boolean {
    if (!this.newDevise.code || this.newDevise.code.trim() === '') {
      this.error = 'Currency code is required';
      return false;
    }
    if (!this.newDevise.name || this.newDevise.name.trim() === '') {
      this.error = 'Currency name is required';
      return false;
    }
    if (this.newDevise.exchangeRate <= 0) {
      this.error = 'Exchange rate must be greater than 0';
      return false;
    }
    return true;
  }

  resetForm() {
    this.newDevise = {
      id: 0,
      code: '',
      name: '',
      exchangeRate: 0
    };
  }
}
