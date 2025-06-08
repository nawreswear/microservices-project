import { Component, OnInit } from '@angular/core';
import { ReglementService } from '../../../services/reglement.service';
import { Reglement, ModePaiement, StatutReglement } from '../../../models/reglement.model';

@Component({
  selector: 'app-reglement-list',
  templateUrl: './reglement-list.component.html',
  styleUrls: ['./reglement-list.component.css']
})
export class ReglementListComponent implements OnInit {
  reglements: Reglement[] = [];
  filteredReglements: Reglement[] = [];
  
  newReglement: Reglement = {
    numeroReglement: '',
    factureId: 0,
    numeroFacture: '',
    clientId: 0,
    montantRegle: 0,
    dateReglement: '',
    modePaiement: ModePaiement.ESPECES,
    statut: StatutReglement.EN_ATTENTE,
    referenceTransaction: '',
    numeroCheque: ''
  };

  editingReglement: Reglement | null = null;
  
  // États de l'interface
  loading = false;
  error = '';
  success = '';
  showForm = false;
  isEditing = false;

  // Filtres
  filterStatut: StatutReglement | '' = '';
  filterMode: ModePaiement | '' = '';
  filterDateDebut = '';
  filterDateFin = '';
  searchTerm = '';

  // Enums pour les templates
  modesPaiement = Object.values(ModePaiement);
  statutsReglement = Object.values(StatutReglement);

  constructor(private reglementService: ReglementService) { }

  ngOnInit() {
    this.loadReglements();
  }

  loadReglements() {
    this.loading = true;
    this.error = '';
    
    this.reglementService.getAll().subscribe({
      next: (data) => {
        this.reglements = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des règlements';
        console.error(err);
        this.loading = false;
      }
    });
  }

  createReglement() {
    if (!this.validateReglement()) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.reglementService.create(this.newReglement).subscribe({
      next: (reglement) => {
        this.reglements.push(reglement);
        this.applyFilters();
        this.resetForm();
        this.success = 'Règlement créé avec succès';
        this.loading = false;
        this.showForm = false;
      },
      error: (err) => {
        this.error = 'Erreur lors de la création du règlement';
        console.error(err);
        this.loading = false;
      }
    });
  }

  updateReglement() {
    if (!this.editingReglement || !this.validateReglement(this.editingReglement)) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.reglementService.update(this.editingReglement.id!, this.editingReglement).subscribe({
      next: (reglement) => {
        const index = this.reglements.findIndex(r => r.id === reglement.id);
        if (index !== -1) {
          this.reglements[index] = reglement;
          this.applyFilters();
        }
        this.success = 'Règlement mis à jour avec succès';
        this.cancelEdit();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors de la mise à jour du règlement';
        console.error(err);
        this.loading = false;
      }
    });
  }

  deleteReglement(id: number) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce règlement ?')) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.reglementService.delete(id).subscribe({
      next: () => {
        this.reglements = this.reglements.filter(r => r.id !== id);
        this.applyFilters();
        this.success = 'Règlement supprimé avec succès';
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors de la suppression du règlement';
        console.error(err);
        this.loading = false;
      }
    });
  }

  editReglement(reglement: Reglement) {
    this.editingReglement = { ...reglement };
    this.isEditing = true;
    this.showForm = true;
  }

  cancelEdit() {
    this.editingReglement = null;
    this.isEditing = false;
    this.showForm = false;
  }

  validateReglement(reglement: Reglement = this.newReglement): boolean {
    if (!reglement.numeroReglement || reglement.numeroReglement.trim() === '') {
      this.error = 'Le numéro de règlement est obligatoire';
      return false;
    }
    if (!reglement.factureId || reglement.factureId <= 0) {
      this.error = 'L\'ID de la facture est obligatoire';
      return false;
    }
    if (!reglement.clientId || reglement.clientId <= 0) {
      this.error = 'L\'ID du client est obligatoire';
      return false;
    }
    if (!reglement.montantRegle || reglement.montantRegle <= 0) {
      this.error = 'Le montant réglé doit être supérieur à 0';
      return false;
    }
    if (!reglement.dateReglement) {
      this.error = 'La date de règlement est obligatoire';
      return false;
    }
    return true;
  }

  resetForm() {
    this.newReglement = {
      numeroReglement: '',
      factureId: 0,
      numeroFacture: '',
      clientId: 0,
      montantRegle: 0,
      dateReglement: '',
      modePaiement: ModePaiement.ESPECES,
      statut: StatutReglement.EN_ATTENTE,
      referenceTransaction: '',
      numeroCheque: ''
    };
  }

  applyFilters() {
    this.filteredReglements = this.reglements.filter(reglement => {
      const matchesStatut = !this.filterStatut || reglement.statut === this.filterStatut;
      const matchesMode = !this.filterMode || reglement.modePaiement === this.filterMode;
      const matchesSearch = !this.searchTerm || 
        reglement.numeroReglement.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        reglement.numeroFacture.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      let matchesDate = true;
      if (this.filterDateDebut && this.filterDateFin) {
        const reglementDate = new Date(reglement.dateReglement);
        const dateDebut = new Date(this.filterDateDebut);
        const dateFin = new Date(this.filterDateFin);
        matchesDate = reglementDate >= dateDebut && reglementDate <= dateFin;
      }

      return matchesStatut && matchesMode && matchesSearch && matchesDate;
    });
  }

  clearFilters() {
    this.filterStatut = '';
    this.filterMode = '';
    this.filterDateDebut = '';
    this.filterDateFin = '';
    this.searchTerm = '';
    this.applyFilters();
  }

  getStatutClass(statut: StatutReglement): string {
    switch (statut) {
      case StatutReglement.PAYE:
        return 'badge-success';
      case StatutReglement.EN_ATTENTE:
        return 'badge-warning';
      case StatutReglement.PARTIELLEMENT_PAYE:
        return 'badge-info';
      case StatutReglement.ANNULE:
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  getModeClass(mode: ModePaiement): string {
    switch (mode) {
      case ModePaiement.ESPECES:
        return 'badge-success';
      case ModePaiement.CHEQUE:
        return 'badge-primary';
      case ModePaiement.VIREMENT:
        return 'badge-info';
      case ModePaiement.CARTE:
        return 'badge-warning';
      case ModePaiement.PAYPAL:
        return 'badge-secondary';
      default:
        return 'badge-light';
    }
  }
}