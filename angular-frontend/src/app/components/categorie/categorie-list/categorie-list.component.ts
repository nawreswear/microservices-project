import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProduitService } from 'src/app/services/produit.service';
import { Categorie } from 'src/app/models/produit.model';
import { AuthService } from 'src/app/services/auth.service';

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
        console.error('Error loading categories:', error);
        this.loading = false;
      }
    });
  }

  onEdit(id: number): void {
    this.router.navigate(['/categories/edit', id]);
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.produitService.deleteCategorie(id).subscribe({
        next: () => {
          this.loadCategories(); // Refresh list
        },
        error: (err) => {
          console.error('Error deleting category:', err);
        }
      });
    }
  }

  onNew(): void {
    this.router.navigate(['/categories/new']);
  }

  get filteredCategories(): Categorie[] {
    if (!this.searchTerm) return this.categories;
    return this.categories.filter(categorie =>
      categorie.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      categorie.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
