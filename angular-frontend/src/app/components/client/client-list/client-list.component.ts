import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Client } from 'src/app/models/client.model';
import { ClientService } from 'src/app/services/client.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'nom', 'prenom', 'email', 'telephone', 'actions'];//, 'chiffreAffaires', 'resteAPayer'
  dataSource = new MatTableDataSource<Client>();
  loading = false;
  loyalClients: Client[] = [];
  searchNom: string = '';
  searchPrenom: string = '';
  selectedClientId: number | null = null;
  //chiffreAffaires: number | null = null;
 // chiffreAffairesParAnnee: number | null = null;
  resteAPayer: number | null = null;
  selectedYear: number = new Date().getFullYear();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private clientService: ClientService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadClients();
    this.loadLoyalClients();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadClients(): void {
    this.loading = true;
    this.clientService.getClients().subscribe({
      next: clients => {
        this.dataSource.data = clients;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Error loading clients', 'Close', { duration: 5000 });
      }
    });
  }

  loadLoyalClients(): void {
    this.clientService.getClientsPlusFideles().subscribe({
      next: clients => {
        this.loyalClients = clients;
      },
      error: () => {
        this.snackBar.open('Error loading loyal clients', 'Close', { duration: 5000 });
      }
    });
  }

  searchClients(): void {
    if (this.searchNom || this.searchPrenom) {
      this.loading = true;
      this.clientService.searchClients(this.searchNom, this.searchPrenom).subscribe({
        next: clients => {
          this.dataSource.data = clients;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Error searching clients', 'Close', { duration: 5000 });
        }
      });
    } else {
      this.loadClients();
    }
  }

 /* getClientRevenue(clientId: number): void {
    this.selectedClientId = clientId;
    this.clientService.getChiffreAffaires(clientId).subscribe({
      next: revenue => this.chiffreAffaires = revenue,
      error: () => {
        this.snackBar.open('Error fetching client revenue', 'Close', { duration: 5000 });
      }
    });
  }

  getClientRevenueByYear(clientId: number, year: number): void {
    this.selectedClientId = clientId;
    this.clientService.getChiffreAffairesParAnnee(clientId, year).subscribe({
      next: revenue => this.chiffreAffairesParAnnee = revenue,
      error: () => {
        this.snackBar.open('Error fetching client revenue by year', 'Close', { duration: 5000 });
      }
    });
  }*/

  getClientOutstandingBalance(clientId: number): void {
    this.selectedClientId = clientId;
    this.clientService.getResteAPayer(clientId).subscribe({
      next: balance => this.resteAPayer = balance,
      error: () => {
        this.snackBar.open('Error fetching client outstanding balance', 'Close', { duration: 5000 });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addClient(): void {
    if (this.canEdit()) {
      this.router.navigate(['/clients/new']);
    } else {
      this.snackBar.open('Access denied: Only admins can add clients', 'Close', { duration: 5000 });
    }
  }

  editClient(client: Client): void {
    if (this.canEdit()) {
      this.router.navigate(['/clients/edit', client.id]);
    } else {
      this.snackBar.open('Access denied: Only admins can edit clients', 'Close', { duration: 5000 });
    }
  }

  deleteClient(client: Client): void {
    if (this.canDelete()) {
      if (confirm(`Are you sure you want to delete client ${client.nom} ${client.prenom}?`)) {
        this.clientService.deleteClient(client.id!).subscribe({
          next: () => {
            this.snackBar.open('Client deleted successfully', 'Close', { duration: 3000 });
            this.loadClients();
            this.loadLoyalClients();
          },
          error: () => {
            this.snackBar.open('Error deleting client', 'Close', { duration: 5000 });
          }
        });
      }
    } else {
      this.snackBar.open('Access denied: Only admins can delete clients', 'Close', { duration: 5000 });
    }
  }

  viewClient(client: Client): void {
    this.router.navigate(['/clients/view', client.id]);
  }

  refresh(): void {
    this.loadClients();
    this.loadLoyalClients();
    this.searchNom = '';
    this.searchPrenom = '';
    this.selectedClientId = null;
   // this.chiffreAffaires = null;
   // this.chiffreAffairesParAnnee = null;
    this.resteAPayer = null;
  }

  exportToCSV(): void {
    const rows = this.dataSource.data.map(client => ({
      ID: client.id,
      Nom: client.nom,
      Prénom: client.prenom,
      Email: client.email,
      Téléphone: client.telephone || '-',
     // 'Chiffre d\'affaires': this.chiffreAffaires !== null ? this.chiffreAffaires : '-',
      'Reste à payer': this.resteAPayer !== null ? this.resteAPayer : '-'
    }));

    const csvContent = [
      Object.keys(rows[0]).join(','),
      ...rows.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'clients.csv';
    link.click();
  }

  canEdit(): boolean {
    return this.authService.isAdmin();
  }

  canDelete(): boolean {
    return this.authService.isAdmin();
  }
}
