import { Component, Output, EventEmitter } from "@angular/core"
import  { Router } from "@angular/router"

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent {
  @Output() closeSidebar = new EventEmitter<void>()

  menuItems = [
    { title: "Tableau de bord", icon: "fas fa-tachometer-alt", route: "/dashboard" },
    { title: "Clients", icon: "fas fa-users", route: "/clients" },
    { title: "Produits", icon: "fas fa-box", route: "/produits" },
    { title: "Catégories", icon: "fas fa-tags", route: "/categories" },
    { title: "Factures", icon: "fas fa-file-invoice", route: "/factures" },
    { title: "Ajouter Client", icon: "fas fa-user-plus", route: "/clients/new" },
    { title: "Ajouter Produit", icon: "fas fa-plus-square", route: "/produits/new" },
    { title: "Ajouter Catégorie", icon: "fas fa-plus-circle", route: "/categories/new" },
    { title: "Ajouter Facture", icon: "fas fa-file-invoice-dollar", route: "/factures/new" },
    // Les routes "Dispositifs", "Règlements", "Rapports", "Paramètres" n'existent pas dans le routing actuel
    // Elles doivent être retirées ou ajoutées dans AppRoutingModule
  ];
  

  constructor(private router: Router) {}

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }
  

  onMenuClick() {
    // Fermer la sidebar sur mobile après clic
    this.closeSidebar.emit()
  }
}
