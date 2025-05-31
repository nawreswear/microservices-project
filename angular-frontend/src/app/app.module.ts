import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

// Root Component
import { AppComponent } from './app.component';

// Auth Components
import { LoginComponent } from './components/auth/login/login.component';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';      
import { SidebarComponent } from './components/sidebar/sidebar.component';  

// Client Components
import { ClientListComponent } from './components/client/client-list/client-list.component';
import { ClientFormComponent } from './components/client/client-form/client-form.component';

// Produit Components
import { ProduitListComponent } from './components/produit/produit-list/produit-list.component';
import { ProduitFormComponent } from './components/produit/produit-form/produit-form.component';

// Categorie Components
import { CategorieListComponent } from './components/categorie/categorie-list/categorie-list.component';
import { CategorieFormComponent } from './components/categorie/categorie-form/categorie-form.component';

// Facture Components
import { FactureListComponent } from './components/facture/facture-list/facture-list.component';
import { FactureFormComponent } from './components/facture/facture-form/facture-form.component';

// Services
import { AuthService } from './services/auth.service';
import { ClientService } from './services/client.service';
import { ProduitService } from './services/produit.service';
import { FactureService } from './services/facture.service';


// Guards
import { AuthGuard } from './guards/auth.guards';
import { AdminGuard } from './guards/admin.guards';

// Interceptors
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { DispositifService } from './services/dispositif.service';
import { AppRoutingModule } from './app-routing.module';
import { APP_BASE_HREF } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ClientListComponent,
    ClientFormComponent,
    ProduitListComponent,
    ProduitFormComponent,
    CategorieListComponent,
    CategorieFormComponent,
    FactureListComponent,
    FactureFormComponent,
    NavbarComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  providers: [
    AuthService,
    ClientService,
    ProduitService,
    FactureService,
    DispositifService,
    AuthGuard,
    AdminGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },{ provide: APP_BASE_HREF, useValue: '/' },
  ],
  bootstrap: [AppComponent],
  
})
export class AppModule {}
