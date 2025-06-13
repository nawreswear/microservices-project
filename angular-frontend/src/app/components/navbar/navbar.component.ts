import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Dropdown } from 'bootstrap';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentUser: { username: string; roles?: string[] } | null = null;

  @Input() isSidebarOpen: boolean = false;
  @Output() toggleSidebar: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('userMenuButton') userMenuButton!: ElementRef<HTMLButtonElement>;
  dropdownInstance: Dropdown | null = null;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    console.log(this.currentUser);
  }

  ngAfterViewInit() {
    if (this.userMenuButton) {
      this.dropdownInstance = new Dropdown(this.userMenuButton.nativeElement);
    }
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
