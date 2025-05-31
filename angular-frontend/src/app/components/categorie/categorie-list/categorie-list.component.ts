import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProduitService } from '../../../services/produit.service';
import { Categorie } from '../../../models/produit.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-categorie-list',
  templateUrl: './categorie-list.component.html',
  styleUrls: ['./categorie-list.component.css']
})
export class CategorieListComponent implements OnInit {
  categories: Categorie[] = [];
  loading = true;
  searchTerm = '';

  constructor(
    private produitService: ProduitService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.produitService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
        this.loading = false;
      }
    });
  }

  onEdit(id: number): void {
    this.router.navigate(['/categories/edit', id]);
  }

  onDelete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      // Implement delete logic here
      console.log('Delete category:', id);
    }
  }

  onNew(): void {
    this.router.navigate(['/categories/new']);
  }

  get filteredCategories(): Categorie[] {
    if (!this.searchTerm) {
      return this.categories;
    }
    return this.categories.filter(categorie =>
      categorie.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      categorie.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}