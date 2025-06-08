import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
} from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil, filter } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  title = "gestion-facturation";
  isLoginPage = false;
  isSidebarOpen = false;
  isMobile = false;

  private destroy$ = new Subject<void>();

  constructor(private router: Router) {}

  @HostListener("window:resize", [])
  onResize(): void {
    this.updateResponsiveState();
  }

  ngOnInit(): void {
    this.updateResponsiveState();
    this.checkCurrentRoute(this.router.url);

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.checkCurrentRoute(event.url);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

 
  private checkCurrentRoute(url: string): void {
    const noSidebarRoutes = [
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password",
      "/verify-email",
      "/unauthorized",
      "/404",
      "/500",
    ];

    this.isLoginPage = noSidebarRoutes.some((route) => url.includes(route));

    // Sidebar default visibility based on screen type
    this.isSidebarOpen = !this.isLoginPage && !this.isMobile;
  }

  private updateResponsiveState(): void {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 1024;

    // If breakpoint changed and we're not on login pages, adjust sidebar
    if (wasMobile !== this.isMobile && !this.isLoginPage) {
      this.isSidebarOpen = !this.isMobile;
    }
  }

  
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  
  closeSidebar(): void {
    if (this.isMobile) {
      this.isSidebarOpen = false;
    }
  }

  
  onSidebarBackdropClick(): void {
    this.closeSidebar();
  }
}
