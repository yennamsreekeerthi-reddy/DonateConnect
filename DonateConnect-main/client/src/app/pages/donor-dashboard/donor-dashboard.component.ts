import { Component, OnInit, AfterViewInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

declare const particlesJS: any;

@Component({
  selector: 'app-donor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-page" (mousemove)="onMouseMove($event)">
      <div id="particles-js"></div>
      
      <div class="floating-shapes">
        <div class="shape shape-1">💝</div>
        <div class="shape shape-2">🎯</div>
        <div class="shape shape-3">⭐</div>
        <div class="shape shape-4">🌟</div>
      </div>

      <div class="dashboard-container">
        <!-- Header Section -->
        <div class="dashboard-header">
          <div class="header-content">
            <div class="welcome-section">
              <div class="avatar-circle" (mouseenter)="createParticles($event)">
                <span class="avatar-icon">👤</span>
              </div>
              <div class="welcome-text">
                <h1 class="welcome-title">Welcome back, {{ user?.name }}! 👋</h1>
                <p class="welcome-subtitle">Continue making a difference in the world</p>
              </div>
            </div>
            
            <div class="header-actions">
              <button 
                class="action-btn donate-btn" 
                routerLink="/nearby"
                (mouseenter)="createParticles($event)"
              >
                <span class="btn-icon">💝</span>
                <span>Find NGOs</span>
              </button>
              <button 
                class="action-btn logout-btn" 
                (click)="logout()"
                (mouseenter)="createParticles($event)"
              >
                <span class="btn-icon">🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card" (mouseenter)="createParticles($event)">
            <div class="stat-icon">💰</div>
            <div class="stat-info">
              <h3 class="stat-value">₹{{ totalAmount }}</h3>
              <p class="stat-label">Total Donated</p>
            </div>
          </div>

          <div class="stat-card" (mouseenter)="createParticles($event)">
            <div class="stat-icon">🎁</div>
            <div class="stat-info">
              <h3 class="stat-value">{{ donations.length }}</h3>
              <p class="stat-label">Total Donations</p>
            </div>
          </div>

          <div class="stat-card" (mouseenter)="createParticles($event)">
            <div class="stat-icon">🏢</div>
            <div class="stat-info">
              <h3 class="stat-value">{{ uniqueNGOs }}</h3>
              <p class="stat-label">NGOs Supported</p>
            </div>
          </div>

          <div class="stat-card" (mouseenter)="createParticles($event)">
            <div class="stat-icon">⭐</div>
            <div class="stat-info">
              <h3 class="stat-value">{{ impactScore }}</h3>
              <p class="stat-label">Impact Score</p>
            </div>
          </div>
        </div>

        <!-- NGOs Supported Section -->
        <div class="ngos-section" *ngIf="supportedNGOs.length > 0">
          <div class="section-header">
            <h2 class="section-title">NGOs You've Supported</h2>
            <p class="section-subtitle">{{ supportedNGOs.length }} organization{{ supportedNGOs.length > 1 ? 's' : '' }} impacted by your generosity</p>
          </div>

          <div class="ngos-grid">
            <div 
              class="ngo-card" 
              *ngFor="let ngo of supportedNGOs; let i = index"
              (mouseenter)="createParticles($event)"
              [style.animation-delay]="i * 0.1 + 's'"
            >
              <div class="ngo-header">
                <div class="ngo-avatar">
                  {{ ngo.organizationName.charAt(0) }}
                </div>
                <div class="ngo-info">
                  <h3 class="ngo-name">{{ ngo.organizationName }}</h3>
                  <p class="ngo-location" *ngIf="ngo.city || ngo.state">
                    📍 {{ ngo.city }}{{ ngo.city && ngo.state ? ', ' : '' }}{{ ngo.state }}
                  </p>
                </div>
              </div>

              <div class="ngo-focus-areas" *ngIf="ngo.focusAreas && ngo.focusAreas.length > 0">
                <span 
                  class="focus-badge" 
                  *ngFor="let area of ngo.focusAreas.slice(0, 3)"
                >
                  {{ area }}
                </span>
              </div>

              <div class="ngo-stats">
                <div class="ngo-stat">
                  <span class="stat-icon">💰</span>
                  <div>
                    <div class="stat-value">₹{{ ngo.totalDonated }}</div>
                    <div class="stat-label">Total Donated</div>
                  </div>
                </div>
                <div class="ngo-stat">
                  <span class="stat-icon">🎁</span>
                  <div>
                    <div class="stat-value">{{ ngo.donationCount }}</div>
                    <div class="stat-label">Donation{{ ngo.donationCount > 1 ? 's' : '' }}</div>
                  </div>
                </div>
              </div>

              <div class="ngo-contact" *ngIf="ngo.contactPhone">
                <span class="contact-icon">📞</span>
                <span class="contact-text">{{ ngo.contactPhone }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Donations Section -->
        <div class="donations-section">
          <div class="section-header">
            <h2 class="section-title">My Donations</h2>
            <div class="filter-tabs">
              <button 
                class="tab" 
                [class.active]="statusFilter === 'ALL'"
                (click)="filterByStatus('ALL')"
              >
                All ({{ donations.length }})
              </button>
              <button 
                class="tab" 
                [class.active]="statusFilter === 'PENDING'"
                (click)="filterByStatus('PENDING')"
              >
                Pending ({{ getPendingCount() }})
              </button>
              <button 
                class="tab" 
                [class.active]="statusFilter === 'COMPLETED'"
                (click)="filterByStatus('COMPLETED')"
              >
                Completed ({{ getCompletedCount() }})
              </button>
            </div>
          </div>

          <div class="donations-list" *ngIf="filteredDonations.length > 0">
            <div 
              class="donation-card" 
              *ngFor="let donation of filteredDonations; let i = index"
              (mouseenter)="createParticles($event)"
              [style.animation-delay]="i * 0.1 + 's'"
            >
              <div class="donation-icon">
                <span *ngIf="donation.type === 'MONEY'">💰</span>
                <span *ngIf="donation.type === 'FOOD'">🍲</span>
                <span *ngIf="donation.type === 'CLOTHES'">👕</span>
                <span *ngIf="donation.type === 'BOOKS'">📚</span>
                <span *ngIf="donation.type === 'OTHER'">🎁</span>
              </div>

              <div class="donation-details">
                <h3 class="donation-ngo">{{ donation.ngo?.organizationName || 'NGO' }}</h3>
                <p class="donation-desc">{{ donation.description }}</p>
                <div class="donation-meta">
                  <span class="meta-item">
                    <span class="meta-icon">📅</span>
                    <span>{{ donation.createdAt | date:'mediumDate' }}</span>
                  </span>
                  <span class="meta-item">
                    <span class="meta-icon">📦</span>
                    <span>{{ donation.type }}</span>
                  </span>
                  <span class="meta-item" *ngIf="donation.pickupRequired">
                    <span class="meta-icon">🚚</span>
                    <span>Pickup Required</span>
                  </span>
                </div>
              </div>

              <div class="donation-status">
                <span 
                  class="status-badge" 
                  [class.pending]="donation.status === 'PENDING'"
                  [class.accepted]="donation.status === 'ACCEPTED'"
                  [class.completed]="donation.status === 'COMPLETED'"
                  [class.rejected]="donation.status === 'REJECTED'"
                >
                  {{ donation.status }}
                </span>
                <div class="donation-amount" *ngIf="donation.amount">
                  ₹{{ donation.amount }}
                </div>
              </div>
            </div>
          </div>

          <div class="empty-state" *ngIf="filteredDonations.length === 0 && donations.length > 0">
            <div class="empty-icon">🔍</div>
            <h3>No {{ statusFilter === 'ALL' ? '' : statusFilter.toLowerCase() }} donations</h3>
            <p>Try selecting a different filter</p>
          </div>

          <div class="empty-state" *ngIf="donations.length === 0">
            <div class="empty-icon">📭</div>
            <h3>No Donations Yet</h3>
            <p>Start your journey of giving by donating to verified NGOs</p>
            <button 
              class="cta-btn" 
              routerLink="/nearby"
              (mouseenter)="createParticles($event)"
            >
              <span>Find NGOs Near You</span>
              <span class="btn-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .dashboard-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      position: relative;
      overflow-x: hidden;
    }

    #particles-js {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 1;
    }

    .floating-shapes {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 2;
      pointer-events: none;
    }

    .shape {
      position: absolute;
      font-size: 3rem;
      animation: float 6s ease-in-out infinite;
      opacity: 0.6;
    }

    .shape-1 { top: 10%; left: 10%; animation-delay: 0s; }
    .shape-2 { top: 70%; left: 80%; animation-delay: 1.5s; }
    .shape-3 { top: 40%; right: 15%; animation-delay: 2s; }
    .shape-4 { top: 80%; left: 20%; animation-delay: 0.5s; }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-30px) rotate(10deg); }
    }

    .dashboard-container {
      position: relative;
      z-index: 3;
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      animation: fadeInUp 0.8s ease-out;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .dashboard-header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 2.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 2rem;
    }

    .welcome-section {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .avatar-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .avatar-circle:hover {
      transform: scale(1.1) rotate(5deg);
    }

    .avatar-icon {
      font-size: 2.5rem;
    }

    .welcome-text {
      flex: 1;
    }

    .welcome-title {
      font-size: 2rem;
      font-weight: 800;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.5rem;
    }

    .welcome-subtitle {
      color: #666;
      font-size: 1.1rem;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .action-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1.2rem 2.5rem;
      font-size: 1.1rem;
      font-weight: 700;
      border-radius: 50px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      border: 2px solid transparent;
      text-decoration: none;
    }

    .donate-btn {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
      animation: btnGlow 2s ease-in-out infinite;
    }

    @keyframes btnGlow {
      0%, 100% {
        box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
      }
      50% {
        box-shadow: 0 15px 60px rgba(102, 126, 234, 0.7);
      }
    }

    .donate-btn:hover {
      transform: translateY(-5px) scale(1.05);
      box-shadow: 0 15px 50px rgba(102, 126, 234, 0.5);
    }

    .logout-btn {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      color: #ff6b6b;
      border: 2px solid rgba(255, 107, 107, 0.3);
    }

    .logout-btn:hover {
      background: rgba(255, 107, 107, 0.2);
      border-color: rgba(255, 107, 107, 0.5);
      transform: translateY(-5px) scale(1.05);
      box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
    }

    .btn-icon {
      font-size: 1.3rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 2rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.3);
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(102, 126, 234, 0.2);
    }

    .stat-icon {
      font-size: 3rem;
      width: 70px;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
      border-radius: 16px;
    }

    .stat-info {
      flex: 1;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 800;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      color: #666;
      font-size: 0.95rem;
      font-weight: 500;
    }

    .donations-section {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 2.5rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .ngos-section {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 2.5rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.3);
      margin-bottom: 2rem;
    }

    .section-subtitle {
      color: #666;
      font-size: 1rem;
      margin-top: 0.5rem;
      font-weight: 500;
    }

    .ngos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    .ngo-card {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(249, 250, 251, 0.9));
      border-radius: 16px;
      padding: 1.5rem;
      border: 2px solid rgba(102, 126, 234, 0.1);
      transition: all 0.3s ease;
      cursor: pointer;
      animation: fadeInUp 0.6s ease backwards;
    }

    .ngo-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 15px 40px rgba(102, 126, 234, 0.25);
      border-color: rgba(102, 126, 234, 0.3);
    }

    .ngo-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .ngo-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .ngo-info {
      flex: 1;
      min-width: 0;
    }

    .ngo-name {
      font-size: 1.1rem;
      font-weight: 700;
      color: #1a202c;
      margin: 0 0 0.25rem 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ngo-location {
      color: #718096;
      font-size: 0.85rem;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .ngo-focus-areas {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .focus-badge {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
      color: #667eea;
      padding: 0.35rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      border: 1px solid rgba(102, 126, 234, 0.2);
    }

    .ngo-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
      padding: 1rem;
      background: rgba(102, 126, 234, 0.05);
      border-radius: 12px;
    }

    .ngo-stat {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .ngo-stat .stat-icon {
      font-size: 1.5rem;
      width: auto;
      height: auto;
      background: none;
    }

    .ngo-stat .stat-value {
      font-size: 1.1rem;
      font-weight: 700;
      color: #667eea;
      background: none;
      -webkit-background-clip: unset;
      -webkit-text-fill-color: unset;
      margin: 0;
    }

    .ngo-stat .stat-label {
      font-size: 0.75rem;
      color: #718096;
      margin: 0;
    }

    .ngo-contact {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: rgba(102, 126, 234, 0.08);
      border-radius: 8px;
      color: #4a5568;
      font-size: 0.9rem;
    }

    .contact-icon {
      font-size: 1.1rem;
    }

    .contact-text {
      font-weight: 600;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .section-title {
      font-size: 1.8rem;
      font-weight: 800;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .filter-tabs {
      display: flex;
      gap: 0.5rem;
      background: rgba(102, 126, 234, 0.1);
      padding: 0.5rem;
      border-radius: 12px;
    }

    .tab {
      padding: 0.75rem 1.5rem;
      border: none;
      background: transparent;
      border-radius: 8px;
      font-weight: 600;
      color: #667eea;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .tab:hover {
      background: rgba(102, 126, 234, 0.2);
    }

    .tab.active {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .donations-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .donation-card {
      background: rgba(102, 126, 234, 0.05);
      border: 2px solid rgba(102, 126, 234, 0.15);
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      transition: all 0.3s ease;
      animation: slideIn 0.5s ease-out;
      animation-fill-mode: both;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .donation-card:hover {
      transform: translateX(10px);
      background: rgba(102, 126, 234, 0.1);
      border-color: #667eea;
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
    }

    .donation-icon {
      font-size: 2.5rem;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
      border-radius: 12px;
    }

    .donation-details {
      flex: 1;
    }

    .donation-ngo {
      font-size: 1.2rem;
      font-weight: 700;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .donation-desc {
      color: #666;
      margin-bottom: 0.75rem;
    }

    .donation-meta {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #667eea;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .meta-icon {
      font-size: 1rem;
    }

    .donation-status {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;
    }

    .status-badge {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    .status-badge.pending {
      background: rgba(251, 191, 36, 0.2);
      color: #d97706;
    }

    .status-badge.accepted {
      background: rgba(59, 130, 246, 0.2);
      color: #2563eb;
    }

    .status-badge.completed {
      background: rgba(34, 197, 94, 0.2);
      color: #16a34a;
    }

    .status-badge.rejected {
      background: rgba(239, 68, 68, 0.2);
      color: #dc2626;
    }

    .donation-amount {
      font-size: 1.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .empty-icon {
      font-size: 5rem;
      margin-bottom: 1.5rem;
      animation: bounce 2s ease-in-out infinite;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }

    .empty-state h3 {
      font-size: 1.8rem;
      font-weight: 700;
      color: #333;
      margin-bottom: 0.75rem;
    }

    .empty-state p {
      color: #666;
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }

    .cta-btn {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      border-radius: 12px;
      padding: 1rem 2rem;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      transition: all 0.3s ease;
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }

    .cta-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
    }

    .btn-arrow {
      font-size: 1.5rem;
      transition: transform 0.3s ease;
    }

    .cta-btn:hover .btn-arrow {
      transform: translateX(5px);
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }

      .dashboard-header {
        padding: 1.5rem;
      }

      .header-content {
        flex-direction: column;
        align-items: stretch;
      }

      .welcome-section {
        flex-direction: column;
        text-align: center;
      }

      .welcome-title {
        font-size: 1.5rem;
      }

      .header-actions {
        flex-direction: column;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .donations-section {
        padding: 1.5rem;
      }

      .section-header {
        flex-direction: column;
        align-items: stretch;
      }

      .filter-tabs {
        overflow-x: auto;
        justify-content: start;
      }

      .donation-card {
        flex-direction: column;
        text-align: center;
      }

      .donation-status {
        align-items: center;
      }
    }
  `]
})
export class DonorDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  user = this.auth.getUser();
  donations: any[] = [];
  filteredDonations: any[] = [];
  statusFilter: 'ALL' | 'PENDING' | 'COMPLETED' = 'ALL';
  totalAmount = 0;
  uniqueNGOs = 0;
  impactScore = 0;
  supportedNGOs: any[] = [];
  private isBrowser: boolean;

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    const token = localStorage.getItem('dc_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    this.http.get<any[]>(`/api/donations/mine?_t=${timestamp}`, { headers }).subscribe({
      next: (donations) => {
        console.log('✅ Fetched donations from API:', donations.length, 'donations');
        console.log('📊 Donations data:', donations);
        
        // Ensure client-side sorting by createdAt desc
        this.donations = this.sortDonations(donations);
        this.filteredDonations = this.donations;
        
        console.log('🎯 After sorting - donations:', this.donations.length);
        console.log('🎯 After sorting - filteredDonations:', this.filteredDonations.length);
        
        this.calculateStats();
      },
      error: (err) => {
        console.error('Failed to fetch donations:', err);
      }
    });

    if (this.isBrowser) {
      this.initParticles();
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      setTimeout(() => {
        this.initScrollAnimations();
      }, 100);
    }
  }

  ngOnDestroy() {
    if (this.isBrowser && typeof particlesJS !== 'undefined') {
      const container = document.getElementById('particles-js');
      if (container) {
        container.innerHTML = '';
      }
    }
  }

  calculateStats() {
    // Calculate total amount
    this.totalAmount = this.donations
      .filter(d => d.amount)
      .reduce((sum, d) => sum + d.amount, 0);

    // Calculate unique NGOs
    const ngoIds = new Set(this.donations.map(d => d.ngo?._id || d.ngo).filter(id => id));
    this.uniqueNGOs = ngoIds.size;

    // Calculate impact score (total donations * 10 + unique NGOs * 50)
    this.impactScore = (this.donations.length * 10) + (this.uniqueNGOs * 50);

    // Extract supported NGOs with aggregated data
    this.extractSupportedNGOs();
  }

  private extractSupportedNGOs() {
    const ngoMap = new Map<string, any>();

    this.donations.forEach(donation => {
      if (donation.ngo && donation.ngo._id) {
        const ngoId = donation.ngo._id;
        
        if (ngoMap.has(ngoId)) {
          // Update existing NGO data
          const existing = ngoMap.get(ngoId);
          existing.totalDonated += donation.amount || 0;
          existing.donationCount += 1;
        } else {
          // Add new NGO
          ngoMap.set(ngoId, {
            _id: ngoId,
            organizationName: donation.ngo.organizationName || 'Anonymous NGO',
            focusAreas: donation.ngo.focusAreas || [],
            city: donation.ngo.city,
            state: donation.ngo.state,
            address: donation.ngo.address,
            contactPhone: donation.ngo.contactPhone,
            totalDonated: donation.amount || 0,
            donationCount: 1
          });
        }
      }
    });

    // Convert map to array and sort by total donated (descending)
    this.supportedNGOs = Array.from(ngoMap.values()).sort((a, b) => b.totalDonated - a.totalDonated);
  }

  private sortDonations(list: any[]): any[] {
    return [...(list || [])].sort((a, b) => {
      const at = new Date(a.createdAt || 0).getTime();
      const bt = new Date(b.createdAt || 0).getTime();
      return bt - at; // desc
    });
  }

  initParticles() {
    if (typeof particlesJS !== 'undefined') {
      particlesJS('particles-js', {
        particles: {
          number: { value: 50, density: { enable: true, value_area: 800 } },
          color: { value: '#ffffff' },
          shape: { type: 'circle' },
          opacity: { value: 0.5, random: true },
          size: { value: 3, random: true },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' },
            resize: true
          }
        },
        retina_detect: true
      });
    }
  }

  initScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.stat-card, .donation-card').forEach((el) => {
      observer.observe(el);
    });
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isBrowser) return;
    
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape: any, index) => {
      const speed = (index + 1) * 0.01;
      const x = (window.innerWidth - event.pageX * speed) / 100;
      const y = (window.innerHeight - event.pageY * speed) / 100;
      shape.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  createParticles(event: MouseEvent) {
    if (!this.isBrowser) return;

    const colors = ['#667eea', '#764ba2', '#f093fb'];
    const particleCount = 5;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle-burst';
      
      const size = Math.random() * 8 + 4;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.position = 'fixed';
      particle.style.left = `${event.clientX}px`;
      particle.style.top = `${event.clientY}px`;
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '9999';
      
      document.body.appendChild(particle);
      
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = Math.random() * 50 + 50;
      const lifetime = Math.random() * 500 + 500;
      
      let posX = event.clientX;
      let posY = event.clientY;
      let velocityX = Math.cos(angle) * velocity;
      let velocityY = Math.sin(angle) * velocity;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / lifetime;
        
        if (progress < 1) {
          posX += velocityX * 0.016;
          posY += velocityY * 0.016;
          velocityY += 0.5;
          
          particle.style.left = `${posX}px`;
          particle.style.top = `${posY}px`;
          particle.style.opacity = `${1 - progress}`;
          
          requestAnimationFrame(animate);
        } else {
          particle.remove();
        }
      };
      
      requestAnimationFrame(animate);
    }
  }

  filterByStatus(status: 'ALL' | 'PENDING' | 'COMPLETED') {
    console.log('🔍 Filtering by status:', status);
    console.log('📦 Total donations available:', this.donations.length);
    
    this.statusFilter = status;
    
    if (status === 'ALL') {
      this.filteredDonations = this.donations;
    } else if (status === 'PENDING') {
      // Show both PENDING and ACCEPTED under Pending tab
      this.filteredDonations = this.sortDonations(
        this.donations.filter(d => d.status === 'PENDING' || d.status === 'ACCEPTED')
      );
    } else {
      this.filteredDonations = this.sortDonations(this.donations.filter(d => d.status === status));
    }
    
    console.log('✨ Filtered donations count:', this.filteredDonations.length);
    console.log('📋 Filtered donations:', this.filteredDonations);
  }

  getPendingCount(): number {
    return this.donations.filter(d => d.status === 'PENDING' || d.status === 'ACCEPTED').length;
  }

  getCompletedCount(): number {
    return this.donations.filter(d => d.status === 'COMPLETED').length;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
