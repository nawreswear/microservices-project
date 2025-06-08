import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClientListComponent } from './components/client/client-list/client-list.component';
import { ClientFormComponent } from './components/client/client-form/client-form.component';
import { ProduitListComponent } from './components/produit/produit-list/produit-list.component';
import { ProduitFormComponent } from './components/produit/produit-form/produit-form.component';
import { CategorieListComponent } from './components/categorie/categorie-list/categorie-list.component';
import { CategorieFormComponent } from './components/categorie/categorie-form/categorie-form.component';
import { FactureListComponent } from './components/facture/facture-list/facture-list.component';
import { FactureFormComponent } from './components/facture/facture-form/facture-form.component';
import { ReglementListComponent } from './components/reglement/reglement-list/reglement-list.component';
import { DeviseListComponent } from './components/devise/devise-list/devise-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'clients', component: ClientListComponent },
  { path: 'clients/new', component: ClientFormComponent },
  { path: 'clients/edit/:id', component: ClientFormComponent },
  { path: 'produits', component: ProduitListComponent },
  { path: 'produits/new', component: ProduitFormComponent },
  { path: 'produits/edit/:id', component: ProduitFormComponent },
  { path: 'categories', component: CategorieListComponent },
  { path: 'categories/new', component: CategorieFormComponent },
  { path: 'categories/edit/:id', component: CategorieFormComponent },
  { path: 'factures', component: FactureListComponent },
  { path: 'factures/new', component: FactureFormComponent },
  { path: 'factures/edit/:id', component: FactureFormComponent },
   { path: 'reglements', component: ReglementListComponent },
   { path: 'devises', component: DeviseListComponent },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }