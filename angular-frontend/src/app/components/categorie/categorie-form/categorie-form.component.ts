import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Categorie } from '../../../models/produit.model';

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
    private router: Router
  ) {
    this.categorieForm = this.formBuilder.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', Validators.required],
      actif: [true]
    });
  }

  ngOnInit(): void {
    this.categorieId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.categorieId;

    if (this.isEditMode) {
      this.loadCategorie();
    }
  }

  loadCategorie(): void {
    // Implement load category logic here
    console.log('Load category:', this.categorieId);
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.categorieForm.invalid) {
      return;
    }

    this.loading = true;
    const categorieData: Categorie = this.categorieForm.value;

    // Implement save logic here
    console.log('Save category:', categorieData);
    
    setTimeout(() => {
      this.router.navigate(['/categories']);
    }, 1000);
  }

  onCancel(): void {
    this.router.navigate(['/categories']);
  }

  get f() { return this.categorieForm.controls; }
}