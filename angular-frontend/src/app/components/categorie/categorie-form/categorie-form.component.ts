import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Categorie } from 'src/app/models/produit.model';
import { ProduitService } from 'src/app/services/produit.service';

@Component({
  selector: 'app-categorie-form',
  templateUrl: './categorie-form.component.html',
  styleUrls: ['./categorie-form.component.css']
})
export class CategorieFormComponent implements OnInit {
  categorieForm: FormGroup;
  isEditMode = false;
  categorieId: number | null = null;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private produitService: ProduitService
  ) {
    this.categorieForm = this.formBuilder.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.categorieId = +this.route.snapshot.params['id'];
    this.isEditMode = !!this.categorieId;

    if (this.isEditMode) {
      this.loadCategorie();
    }
  }

  loadCategorie(): void {
    this.produitService.getCategorie(this.categorieId!).subscribe({
      next: (categorie) => {
        this.categorieForm.patchValue(categorie);
      },
      error: (err) => {
        console.error('Error loading category:', err);
        this.router.navigate(['/categories']);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.categorieForm.invalid) return;

    this.loading = true;
    const categorieData: Categorie = this.categorieForm.value;

    if (this.isEditMode) {
      this.produitService.updateCategorie(this.categorieId!, categorieData).subscribe({
        next: () => this.router.navigate(['/categories']),
        error: (err) => {
          console.error('Error updating category:', err);
          this.loading = false;
        }
      });
    } else {
      this.produitService.createCategorie(categorieData).subscribe({
        next: () => this.router.navigate(['/categories']),
        error: (err) => {
          console.error('Error creating category:', err);
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/categories']);
  }

  get f() { return this.categorieForm.controls; }
}
