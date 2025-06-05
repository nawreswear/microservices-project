import { Component, OnInit } from '@angular/core';
import { Facture } from 'src/app/models/facture.model';
import { AuthService } from 'src/app/services/auth.service';
import { FactureService } from 'src/app/services/facture.service';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-facture-list',
  templateUrl: './facture-list.component.html',
  styleUrls: ['./facture-list.component.css']
})
export class FactureListComponent implements OnInit {
  factures: Facture[] = [];
  filteredFactures: Facture[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  // Form handling
  newFacture: Facture = this.getEmptyFacture();
  editing: boolean = false;
  showForm: boolean = false;

  // Dropdown data
  clientNames: string[] = [];

  constructor(
    public authService: AuthService,
    private factureService: FactureService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.loadFactures();
    this.loadClientNames();
  }

  /** Fetches all client names for the dropdown */
  loadClientNames(): void {
    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.clientNames = clients.map(client => client.nom);
      },
      error: (err) => {
        console.error('Failed to load client names', err);
        this.clientNames = [];
      }
    });
  }

  /** Creates a new empty facture object */
  getEmptyFacture(): Facture {
    const now = new Date().toISOString();
    return {
      id: undefined,
      numeroFacture: '',
      clientId: 0,
      clientNom: '',
      dateFacture: now,
      dateEcheance: undefined,
      montantHT: 0,
      montantTVA: 0,
      montantTTC: 0,
      tauxTVA: 20,
      statut: 'BROUILLON',
      lignes: [],
      modePaiement: '',
      observations: '',
      dateCreation: undefined,
      dateModification: undefined
    };
  }

  /** Loads all factures from the backend */
  loadFactures(): void {
    this.loading = true;
    this.factureService.getFactures().subscribe({
      next: (data) => {
        this.factures = data;
        this.filteredFactures = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load invoices.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  /** Filter factures by search term */
  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredFactures = term.length > 0 ? this.factures.filter(f =>
      f.numeroFacture.toLowerCase().includes(term) ||
      (f.clientNom && f.clientNom.toLowerCase().includes(term))
    ) : this.factures;
  }

  /** Handles create or update form submission */
  onSubmit(): void {
    const now = new Date().toISOString();

    // Calculate montantTVA and montantTTC based on montantHT and tauxTVA
    const montantHT = this.newFacture.montantHT || 0;
    const tauxTVA = this.newFacture.tauxTVA || 20;
    const montantTVA = montantHT * (tauxTVA / 100);
    const montantTTC = montantHT + montantTVA;

    const payload: Facture = {
      ...this.newFacture,
      dateFacture: this.formatToDateTime(this.newFacture.dateFacture || now),
      dateEcheance: this.newFacture.dateEcheance
        ? this.formatToDateTime(this.newFacture.dateEcheance)
        : undefined,
      dateCreation: this.newFacture.dateCreation || now,
      dateModification: now,
      montantHT: montantHT,
      montantTVA: montantTVA,
      montantTTC: montantTTC,
      modePaiement: this.newFacture.modePaiement || 'Inconnu',
      observations: this.newFacture.observations || '',
      tauxTVA: tauxTVA,
      statut: this.newFacture.statut || 'BROUILLON'
    };

    if (this.editing) {
      if (!this.newFacture.id) {
        this.errorMessage = 'Invoice ID is missing for update.';
        return;
      }

      this.factureService.updateFacture(this.newFacture.id, payload).subscribe({
        next: () => {
          this.loadFactures();
          this.resetForm();
        },
        error: (err) => {
          this.errorMessage = 'Failed to update invoice.';
          console.error(err);
        }
      });
    } else {
      this.factureService.createFacture(payload).subscribe({
        next: () => {
          this.loadFactures();
          this.resetForm();
        },
        error: (err) => {
          this.errorMessage = 'Failed to add invoice.';
          console.error(err);
        }
      });
    }
  }

  /** Converts a date to ISO string */
  formatToDateTime(dateInput: any): string {
    const date = new Date(dateInput);
    return date.toISOString();
  }

  /** Enables edit mode for selected facture */
  onEdit(facture: Facture): void {
    this.newFacture = { ...facture };
    this.showForm = true;
    this.editing = true;
  }

  /** Starts creating a new facture */
  startCreate(): void {
    this.newFacture = this.getEmptyFacture();
    this.showForm = true;
    this.editing = false;
  }

  /** Deletes a facture after confirmation */
  onDelete(id: number): void {
    const confirmed = confirm('Are you sure you want to delete this invoice?');
    if (confirmed) {
      this.factureService.deleteFacture(id).subscribe({
        next: () => this.loadFactures(),
        error: (err) => {
          this.errorMessage = 'Failed to delete invoice.';
          console.error(err);
        }
      });
    }
  }

  /** Resets the form and hides it */
  resetForm(): void {
    this.newFacture = this.getEmptyFacture();
    this.editing = false;
    this.showForm = false;
    this.errorMessage = '';
  }
}
