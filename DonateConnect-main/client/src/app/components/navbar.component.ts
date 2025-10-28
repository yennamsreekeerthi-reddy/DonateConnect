import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService, User } from '../core/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <a routerLink="/" class="navbar-brand">
          <span class="brand-icon">💝</span>
          <span class="brand-text">DonateConnect</span>
        </a>

        <div class="navbar-menu">
          <a routerLink="/" class="nav-link">Home</a>
          <a routerLink="/nearby-ngos" class="nav-link">Find NGOs</a>

          <div *ngIf="!user" class="nav-auth">
            <a routerLink="/login" class="nav-link">Login</a>
            <a routerLink="/signup" class="btn-signup">Sign Up</a>
          </div>

          <div *ngIf="user" class="nav-user">
            <span class="user-welcome">Hi, {{ user.name }}</span>
            <div class="user-dropdown">
              <button class="user-avatar" (click)="toggleDropdown()">
                <span class="avatar-text">{{ user.name.charAt(0) }}</span>
              </button>
              <div class="dropdown-menu" *ngIf="showDropdown">
                <a [routerLink]="getDashboardRoute()" class="dropdown-item">
                  <span class="dropdown-icon">📊</span>
                  Dashboard
                </a>
                <button (click)="logout()" class="dropdown-item logout">
                  <span class="dropdown-icon">🚪</span>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: rgba(10, 10, 10, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      z-index: 1000;
      padding: 1rem 0;
    }

    .navbar-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      font-size: 1.5rem;
      font-weight: 800;
      color: #fff;
      transition: transform 0.3s ease;
    }

    .navbar-brand:hover {
      transform: scale(1.05);
    }

    .brand-icon {
      font-size: 2rem;
    }

    .brand-text {
      background: linear-gradient(135deg, #667eea, #f093fb);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .navbar-menu {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .nav-link {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s ease;
      position: relative;
    }

    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      transition: width 0.3s ease;
    }

    .nav-link:hover {
      color: #fff;
    }

    .nav-link:hover::after {
      width: 100%;
    }

    .nav-auth {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .btn-signup {
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: #fff;
      text-decoration: none;
      border-radius: 25px;
      font-weight: 700;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .btn-signup:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
    }

    .nav-user {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-welcome {
      color: rgba(255, 255, 255, 0.8);
      font-weight: 600;
    }

    .user-dropdown {
      position: relative;
    }

    .user-avatar {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border: 2px solid rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .user-avatar:hover {
      transform: scale(1.1);
      border-color: rgba(255, 255, 255, 0.4);
    }

    .avatar-text {
      color: #fff;
      font-size: 1.2rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      background: rgba(18, 18, 18, 0.98);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      min-width: 200px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
      overflow: hidden;
      animation: dropdownSlide 0.3s ease;
    }

    @keyframes dropdownSlide {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      border: none;
      background: none;
      width: 100%;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 600;
    }

    .dropdown-item:hover {
      background: rgba(102, 126, 234, 0.2);
      color: #fff;
    }

    .dropdown-item.logout {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      color: #ff6b6b;
    }

    .dropdown-item.logout:hover {
      background: rgba(255, 107, 107, 0.2);
    }

    .dropdown-icon {
      font-size: 1.2rem;
    }

    @media (max-width: 768px) {
      .navbar-container {
        padding: 0 1rem;
      }

      .navbar-menu {
        gap: 1rem;
      }

      .user-welcome {
        display: none;
      }

      .nav-link {
        font-size: 0.9rem;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  user: User | null = null;
  showDropdown = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  getDashboardRoute(): string {
    if (!this.user) return '/';
    
    switch (this.user.role) {
      case 'DONOR':
        return '/donor';
      case 'NGO':
        return '/ngo';
      case 'ADMIN':
        return '/admin';
      default:
        return '/';
    }
  }

  logout() {
    this.authService.logout();
    this.showDropdown = false;
    this.router.navigate(['/']);
  }
}
