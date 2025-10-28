import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <a routerLink="/" class="logo">
          <span class="logo-icon">❤️</span>
          DonateConnect
        </a>
        
        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/nearby-ngos" routerLinkActive="active">Find NGOs</a>
          
          <ng-container *ngIf="!isLoggedIn">
            <a routerLink="/login" routerLinkActive="active" class="nav-btn">Login</a>
            <a routerLink="/signup" routerLinkActive="active" class="nav-btn btn-primary">Sign Up</a>
          </ng-container>
          
          <ng-container *ngIf="isLoggedIn">
            <a [routerLink]="dashboardRoute" routerLinkActive="active">Dashboard</a>
            <button (click)="logout()" class="nav-btn btn-logout">Logout</button>
          </ng-container>
        </div>

        <button class="mobile-toggle" (click)="toggleMobileMenu()">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>
      </div>

      <div class="mobile-menu" [class.active]="mobileMenuOpen">
        <a routerLink="/" (click)="closeMobileMenu()" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
        <a routerLink="/nearby-ngos" (click)="closeMobileMenu()" routerLinkActive="active">Find NGOs</a>
        
        <ng-container *ngIf="!isLoggedIn">
          <a routerLink="/login" (click)="closeMobileMenu()" routerLinkActive="active">Login</a>
          <a routerLink="/signup" (click)="closeMobileMenu()" routerLinkActive="active">Sign Up</a>
        </ng-container>
        
        <ng-container *ngIf="isLoggedIn">
          <a [routerLink]="dashboardRoute" (click)="closeMobileMenu()" routerLinkActive="active">Dashboard</a>
          <a (click)="logout()" class="logout-link">Logout</a>
        </ng-container>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: #667eea;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .logo-icon {
      font-size: 1.75rem;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .nav-links a {
      color: #333;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
      padding: 0.5rem 0;
    }

    .nav-links a:hover {
      color: #667eea;
    }

    .nav-links a.active {
      color: #667eea;
      border-bottom: 2px solid #667eea;
    }

    .nav-btn {
      padding: 0.5rem 1.25rem;
      border-radius: 6px;
      border: 2px solid #667eea;
      background: transparent;
      color: #667eea;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .nav-btn:hover {
      background: #667eea;
      color: white;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background: #5568d3;
    }

    .btn-logout {
      background: #dc3545;
      border-color: #dc3545;
      color: white;
    }

    .btn-logout:hover {
      background: #c82333;
      border-color: #c82333;
    }

    .mobile-toggle {
      display: none;
      flex-direction: column;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
    }

    .bar {
      width: 25px;
      height: 3px;
      background: #333;
      margin: 3px 0;
      transition: 0.3s;
    }

    .mobile-menu {
      display: none;
      flex-direction: column;
      background: white;
      padding: 1rem 2rem;
      gap: 1rem;
      border-top: 1px solid #eee;
    }

    .mobile-menu a {
      color: #333;
      text-decoration: none;
      font-weight: 500;
      padding: 0.75rem;
      border-radius: 6px;
      transition: background 0.3s ease;
    }

    .mobile-menu a:hover,
    .mobile-menu a.active {
      background: #f0f0f0;
      color: #667eea;
    }

    .logout-link {
      color: #dc3545 !important;
      cursor: pointer;
    }

    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }

      .mobile-toggle {
        display: flex;
      }

      .mobile-menu.active {
        display: flex;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  dashboardRoute = '/donor';
  mobileMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      if (user) {
        this.dashboardRoute = `/${user.role.toLowerCase()}`;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.closeMobileMenu();
    this.router.navigate(['/']);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
}
