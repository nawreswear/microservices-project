import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Client } from '../../../models/client.model';
import { ClientService } from '../../../services/client.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nom', 'prenom', 'email', 'telephone', 'actions'];
  dataSource = new MatTableDataSource<Client>();
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private clientService: ClientService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadClients();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadClients(): void {
    this.loading = true;
    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.dataSource.data = clients;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Erreur lors du chargement des clients', 'Fermer', { duration: 5000 });
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

  editClient(client: Client): void {
    this.router.navigate(['/clients/edit', client.id]);
  }

  deleteClient(client: Client): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le client ${client.nom} ${client.prenom} ?`)) {
      this.clientService.deleteClient(client.id!).subscribe({
        next: () => {
          this.snackBar.open('Client supprimé avec succès', 'Fermer', { duration: 3000 });
          this.loadClients();
        },
        error: (error) => {
          this.snackBar.open('Erreur lors de la suppression du client', 'Fermer', { duration: 5000 });
        }
      });
    }
  }

  addClient(): void {
    this.router.navigate(['/clients/new']);
  }

  canEdit(): boolean {
    return this.authService.isAdmin();
  }

  canDelete(): boolean {
    return this.authService.isAdmin();
  }
}