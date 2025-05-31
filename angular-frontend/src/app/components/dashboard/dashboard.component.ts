import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { FactureService } from '../../services/facture.service';

import { AuthService } from '../../services/auth.service';
import { DispositifService } from 'src/app/services/dispositif.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats = {
    totalClients: 0,
    totalFactures: 0,
    facturesEnRetard: 0,
    dispositifsEnRupture: 0,
    chiffreAffaires: 0
  };

  recentFactures: any[] = [];
  dispositifsEnRupture: any[] = [];
  loading = true;

  constructor(
    private clientService: ClientService,
    private factureService: FactureService,
    private dispositifService: DispositifService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    // Charger les statistiques
    this.clientService.getClients().subscribe(clients => {
      this.stats.totalClients = clients.length;
    });

    this.factureService.getFactures().subscribe(factures => {
      this.stats.totalFactures = factures.length;
      this.recentFactures = factures.slice(0, 5);
      this.stats.chiffreAffaires = factures
        .filter(f => f.statut === 'PAYEE')
        .reduce((sum, f) => sum + f.montantTTC, 0);
    });

    this.factureService.getFacturesEnRetard().subscribe(facturesEnRetard => {
      this.stats.facturesEnRetard = facturesEnRetard.length;
    });

    this.dispositifService.getDispositifsEnRupture().subscribe(dispositifs => {
      this.stats.dispositifsEnRupture = dispositifs.length;
      this.dispositifsEnRupture = dispositifs.slice(0, 5);
      this.loading = false;
    });
  }
}