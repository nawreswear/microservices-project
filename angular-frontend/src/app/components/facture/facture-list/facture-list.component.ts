import { Component, OnInit } from '@angular/core';
import { Facture, StatutFacture } from 'src/app/models/facture.model';
import { AuthService } from 'src/app/services/auth.service';
import { FactureService } from 'src/app/services/facture.service';
import { ClientService } from 'src/app/services/client.service';

interface Client {
  id: number;
  nom: string;
}

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
  clients: Client[] = [];
  statutOptions = Object.values(StatutFacture);

  constructor(
    public authService: AuthService,
    private factureService: FactureService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.loadFactures();
    //this.loadClients();
  }

  /** Fetches all clients for the dropdown 
  loadClients(): void {
    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.clientService = clients;
      },
      error: (err) => {
        console.error('Failed to load clients', err);
        this.clients = [];
      }
    });
  }*/

  /** Creates a new empty facture object */
  getEmptyFacture(): Facture {
    const now = new Date().toISOString();
    return {
      numeroFacture: '',
      clientId: 0,
      dateFacture: now,
      dateEcheance: undefined,
      montantHT: 0,
      montantTVA: 0,
      montantTTC: 0,
      tauxTVA: 20,
      statut: StatutFacture.BROUILLON,
      lignes: [],
      modePaiement: '',
      observations: ''
    };
  }

  /** Loads all factures from the backend */
  loadFactures(): void {
    this.loading = true;
    this.factureService.getFactures().subscribe({
      next: (data) => {
        // Enrichir les factures avec les noms des clients
        this.factures = data.map(facture => ({
          ...facture,
          clientNom: this.getClientName(facture.clientId)
        }));
        this.filteredFactures = this.factures;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load invoices.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  /** Get client name by ID */
  getClientName(clientId: number): string {
    const client = this.clients.find(c => c.id === clientId);
    return client ? client.nom : 'Client inconnu';
  }

  /** Filter factures by search term */
  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredFactures = term.length > 0 ? this.factures.filter(f =>
      f.numeroFacture.toLowerCase().includes(term) ||
      (f.clientNom && f.clientNom.toLowerCase().includes(term))
    ) : this.factures;
  }

  /** Calculate TVA and TTC when HT or TVA rate changes */
  calculateMontants(): void {
    const montantHT = this.newFacture.montantHT || 0;
    const tauxTVA = this.newFacture.tauxTVA || 20;
    
    this.newFacture.montantTVA = montantHT * (tauxTVA / 100);
    this.newFacture.montantTTC = montantHT + this.newFacture.montantTVA;
  }

  /** Handles create or update form submission */
  onSubmit(): void {
    // Ensure calculations are up to date
    this.calculateMontants();

    // Prepare payload
    const payload: Facture = {
      ...this.newFacture,
      dateFacture: this.formatToBackendDateTime(this.newFacture.dateFacture),
      dateEcheance: this.newFacture.dateEcheance 
        ? this.formatToBackendDateTime(this.newFacture.dateEcheance)
        : undefined
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

  /** Converts date from form to backend format (ISO string) */
  formatToBackendDateTime(dateInput: string): string {
    // If it's already an ISO string, return as is
    if (dateInput.includes('T')) {
      return dateInput;
    }
    
    // If it's a date string from HTML date input (YYYY-MM-DD)
    const date = new Date(dateInput + 'T00:00:00');
    return date.toISOString();
  }

  /** Converts backend date to form format (YYYY-MM-DD) */
  formatToFormDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  /** Enables edit mode for selected facture */
  onEdit(facture: Facture): void {
    this.newFacture = {
      ...facture,
      dateFacture: this.formatToFormDate(facture.dateFacture),
      dateEcheance: facture.dateEcheance ? this.formatToFormDate(facture.dateEcheance) : undefined
    };
    this.showForm = true;
    this.editing = true;
  }

  /** Starts creating a new facture */
  startCreate(): void {
    this.newFacture = this.getEmptyFacture();
    // Format date for form input
    this.newFacture.dateFacture = this.formatToFormDate(this.newFacture.dateFacture);
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

  /** Validates a facture */
  onValidate(id: number): void {
    this.factureService.validerFacture(id).subscribe({
      next: () => {
        this.loadFactures();
      },
      error: (err) => {
        this.errorMessage = 'Failed to validate invoice.';
        console.error(err);
      }
    });
  }

  /** Marks a facture as paid */
  onMarkAsPaid(id: number): void {
    this.factureService.marquerCommePaye(id).subscribe({
      next: () => {
        this.loadFactures();
      },
      error: (err) => {
        this.errorMessage = 'Failed to mark invoice as paid.';
        console.error(err);
      }
    });
  }

  /** Get overdue invoices */
  loadOverdueInvoices(): void {
    this.factureService.getFacturesEnRetard().subscribe({
      next: (data) => {
        this.factures = data.map(facture => ({
          ...facture,
          clientNom: this.getClientName(facture.clientId)
        }));
        this.filteredFactures = this.factures;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load overdue invoices.';
        console.error(err);
      }
    });
  }

  /** Resets the form and hides it */
  resetForm(): void {
    this.newFacture = this.getEmptyFacture();
    this.editing = false;
    this.showForm = false;
    this.errorMessage = '';
  }

  /** Handle client selection change */
  onClientChange(): void {
    // Update clientNom when clientId changes
    const selectedClient = this.clients.find(c => c.id === this.newFacture.clientId);
    if (selectedClient) {
      this.newFacture.clientNom = selectedClient.nom;
    }
  }
}