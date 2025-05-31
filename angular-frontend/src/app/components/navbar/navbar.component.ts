import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  @Input() isSidebarOpen: boolean = false;

  @Output() toggleSidebar: EventEmitter<void> = new EventEmitter<void>();

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  onLogout(): void {
    // Logout logic here
    console.log('Logout...');
  }
}
