import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Facture } from 'src/app/models/facture.model';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-facture-list',
  templateUrl: './facture-list.component.html',
  styleUrls: ['./facture-list.component.css']
})
export class FactureListComponent implements OnInit {
  factures: Facture[] = [];
  filteredFactures: Facture[] = [];
  searchTerm: string = '';
  loading = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadFactures();
  }

  loadFactures(): void {
    this.loading = true;
    
    // Simulation de données pour le développement
    setTimeout(() => {
      this.factures = [
        {
          id: 1,
          numeroFacture: 'FAC-2024-001',
          dateFacture: new Date(),
          dateEcheance: new Date(),
          clientId: 1,
          clientNom: 'Jean Dupont',
          montantHT: 1000,
          montantTVA: 200,
          montantTTC: 1200,
          tauxTVA: 20,
          statut: 'PAYEE',
          lignes: []
        },
        {
          id: 2,
          numeroFacture: 'FAC-2024-002',
          dateFacture: new Date(),
          dateEcheance: new Date(),
          clientId: 2,
          clientNom: 'Sophie Martin',
          montantHT: 2000,
          montantTVA: 400,
          montantTTC: 2400,
          tauxTVA: 20,
          statut: 'ENVOYEE',
          lignes: []
        }
      ];
      
      this.filteredFactures = this.factures;
      this.loading = false;
    }, 1000);
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredFactures = this.factures;
    } else {
      this.filteredFactures = this.factures.filter(facture =>
        facture.numeroFacture.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (facture.clientNom && facture.clientNom.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }
  }

  onNew(): void {
    this.router.navigate(['/factures/new']);
  }

  onEdit(id: number): void {
    this.router.navigate(['/factures/edit', id]);
  }

  onDelete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      this.factures = this.factures.filter(f => f.id !== id);
      this.filteredFactures = this.filteredFactures.filter(f => f.id !== id);
    }
  }
}
