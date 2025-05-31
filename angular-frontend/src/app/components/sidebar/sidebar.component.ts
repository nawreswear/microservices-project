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
    { title: "Factures", icon: "fas fa-file-invoice", route: "/factures" },
    { title: "Dispositifs", icon: "fas fa-mobile-alt", route: "/dispositifs" },
    { title: "Règlements", icon: "fas fa-credit-card", route: "/reglements" },
    { title: "Rapports", icon: "fas fa-chart-bar", route: "/rapports" },
    { title: "Paramètres", icon: "fas fa-cog", route: "/parametres" },
  ]

  constructor(private router: Router) {}

  isActive(route: string): boolean {
    return this.router.url.includes(route)
  }

  onMenuClick() {
    // Fermer la sidebar sur mobile après clic
    this.closeSidebar.emit()
  }
}
