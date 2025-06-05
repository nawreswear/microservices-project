import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProduitService } from 'src/app/services/produit.service';
import { Produit, Categorie } from 'src/app/models/produit.model';

@Component({
  selector: 'app-produit-form',
  templateUrl: './produit-form.component.html',
  styleUrls: ['./produit-form.component.css']
})
export class ProduitFormComponent implements OnInit {
  produitForm: FormGroup;
  isEditMode = false;
  produitId: number | null = null;
  loading = false;
  submitted = false;
  categories: Categorie[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private produitService: ProduitService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.produitForm = this.formBuilder.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', Validators.required],
      image_url: [''],
      prix: ['', [Validators.required, Validators.min(0)]],
      stock_disponible: ['', [Validators.required, Validators.min(0)]],
      stock_minimum: ['', [Validators.required, Validators.min(0)]],
      categorie_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.produitId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.produitId;

    this.loadCategories();

    if (this.isEditMode) {
      this.loadProduit();
    }
  }

  loadCategories(): void {
    this.produitService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadProduit(): void {
    if (this.produitId) {
      this.loading = true;
      this.produitService.getProduit(this.produitId).subscribe({
        next: (produit) => {
          this.produitForm.patchValue(produit);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading product:', error);
          this.loading = false;
        }
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.produitForm.invalid) {
      return;
    }

    this.loading = true;
    const produitData: Produit = this.produitForm.value;

    const operation = this.isEditMode
      ? this.produitService.updateProduit(this.produitId!, produitData)
      : this.produitService.createProduit(produitData);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/produits']);
      },
      error: (error) => {
        console.error('Error saving product:', error);
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/produits']);
  }

  get f() {
    return this.produitForm.controls;
  }
}
