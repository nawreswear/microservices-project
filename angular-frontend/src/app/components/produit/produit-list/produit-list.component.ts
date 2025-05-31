import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProduitService } from '../../../services/produit.service';
import { Produit } from '../../../models/produit.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-produit-list',
  templateUrl: './produit-list.component.html',
  styleUrls: ['./produit-list.component.css']
})
export class ProduitListComponent implements OnInit {
  produits: Produit[] = [];
  filteredProduits: Produit[] = [];
  loading = true;
  searchTerm = '';

  constructor(
    private produitService: ProduitService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProduits();
  }

  loadProduits(): void {
    this.loading = true;
    this.produitService.getProduits().subscribe({
      next: (produits) => {
        this.produits = produits;
        this.filteredProduits = produits;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des produits:', error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.produitService.searchProduits(this.searchTerm).subscribe({
        next: (produits) => {
          this.filteredProduits = produits;
        },
        error: (error) => {
          console.error('Erreur lors de la recherche:', error);
        }
      });
    } else {
      this.filteredProduits = this.produits;
    }
  }

  onEdit(id: number): void {
    this.router.navigate(['/produits/edit', id]);
  }

  onDelete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.produitService.deleteProduit(id).subscribe({
        next: () => {
          this.loadProduits();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }

  onNew(): void {
    this.router.navigate(['/produits/new']);
  }

  getStockStatus(produit: Produit): string {
    if (produit.quantiteStock <= 0) {
      return 'danger';
    } else if (produit.quantiteStock <= produit.seuilAlerte) {
      return 'warning';
    }
    return 'success';
  }

  getStockText(produit: Produit): string {
    if (produit.quantiteStock <= 0) {
      return 'Rupture';
    } else if (produit.quantiteStock <= produit.seuilAlerte) {
      return 'Stock faible';
    }
    return 'En stock';
  }
}