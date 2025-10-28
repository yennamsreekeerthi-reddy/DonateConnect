import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-ngo-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ngo-dashboard">
      <!-- Header -->
      <header class="ngo-header">
        <div class="header-content">
          <div class="logo-section">
            <div class="logo-icon">🏥</div>
            <div class="org-info">
              <h1>{{ ngoProfile?.organizationName || 'NGO Dashboard' }}</h1>
              <p class="verification-badge" [class.verified]="ngoProfile?.verified">
                {{ ngoProfile?.verified ? '✓ Verified NGO' : '⏳ Pending Verification' }}
              </p>
            </div>
          </div>
          <div class="header-actions">
            <span class="user-name">👤 {{ user?.name }}</span>
            <button class="btn-logout" (click)="logout()">Logout</button>
          </div>
        </div>
      </header>

      <div class="dashboard-container">
        <!-- Stats Overview -->
        <div class="stats-grid">
          <div class="stat-card pending">
            <div class="stat-icon">⏳</div>
            <div class="stat-details">
              <h3>{{ pendingDonations.length }}</h3>
              <p>Pending Donations</p>
            </div>
          </div>
          <div class="stat-card accepted">
            <div class="stat-icon">✓</div>
            <div class="stat-details">
              <h3>{{ acceptedDonations.length }}</h3>
              <p>Accepted</p>
            </div>
          </div>
          <div class="stat-card completed">
            <div class="stat-icon">🎯</div>
            <div class="stat-details">
              <h3>{{ completedDonations.length }}</h3>
              <p>Completed</p>
            </div>
          </div>
          <div class="stat-card total-amount">
            <div class="stat-icon">💰</div>
            <div class="stat-details">
              <h3>₹{{ totalAmount | number:'1.0-0' }}</h3>
              <p>Total Amount Received</p>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="tabs">
          <button 
            [class.active]="activeTab === 'pending'" 
            (click)="activeTab = 'pending'"
            class="tab-btn">
            ⏳ Pending ({{ pendingDonations.length }})
          </button>
          <button 
            [class.active]="activeTab === 'accepted'" 
            (click)="activeTab = 'accepted'"
            class="tab-btn">
            ✓ Accepted ({{ acceptedDonations.length }})
          </button>
          <button 
            [class.active]="activeTab === 'completed'" 
            (click)="activeTab = 'completed'"
            class="tab-btn">
            ✅ Completed ({{ completedDonations.length }})
          </button>
          <button 
            [class.active]="activeTab === 'profile'" 
            (click)="activeTab = 'profile'"
            class="tab-btn">
            📋 Profile
          </button>
        </div>

        <!-- Pending Donations Tab -->
        <div class="tab-content" *ngIf="activeTab === 'pending'">
          <div class="donations-list" *ngIf="pendingDonations.length > 0; else noPending">
            <div class="donation-card" *ngFor="let donation of pendingDonations">
              <div class="donation-header">
                <div class="donation-type" [class]="donation.type.toLowerCase()">
                  {{ getDonationIcon(donation.type) }} {{ donation.type }}
                </div>
                <div class="donation-date">{{ donation.createdAt | date:'short' }}</div>
              </div>
              
              <div class="donation-details">
                <div class="detail-row">
                  <span class="label">Donor:</span>
                  <span class="value">{{ donation.donor?.name || 'Anonymous' }}</span>
                </div>
                <div class="detail-row" *ngIf="donation.type === 'MONEY'">
                  <span class="label">Amount:</span>
                  <span class="value amount">₹{{ donation.amount }}</span>
                </div>
                <div class="detail-row" *ngIf="donation.type !== 'MONEY'">
                  <span class="label">Items:</span>
                  <span class="value">{{ donation.description || 'No description' }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Pickup Required:</span>
                  <span class="value">{{ donation.pickupRequired ? '✓ Yes' : '✗ No' }}</span>
                </div>
                <div class="detail-row" *ngIf="donation.pickupRequired">
                  <span class="label">Pickup Address:</span>
                  <span class="value">{{ donation.pickupAddress }}</span>
                </div>
                <div class="detail-row" *ngIf="donation.donorPhone">
                  <span class="label">Contact:</span>
                  <span class="value">📞 {{ donation.donorPhone }}</span>
                </div>
              </div>

              <div class="donation-actions">
                <button class="btn-accept" (click)="acceptDonation(donation._id)">
                  ✓ Accept Donation
                </button>
                <button class="btn-reject" (click)="rejectDonation(donation._id)">
                  ✗ Decline
                </button>
              </div>
            </div>
          </div>
          <ng-template #noPending>
            <div class="empty-state">
              <div class="empty-icon">📭</div>
              <h3>No Pending Donations</h3>
              <p>All donations have been reviewed</p>
            </div>
          </ng-template>
        </div>

        <!-- Accepted Donations Tab -->
        <div class="tab-content" *ngIf="activeTab === 'accepted'">
          <div class="donations-list" *ngIf="acceptedDonations.length > 0; else noAccepted">
            <div class="donation-card accepted-card" *ngFor="let donation of acceptedDonations">
              <div class="donation-header">
                <div class="donation-type" [class]="donation.type.toLowerCase()">
                  {{ getDonationIcon(donation.type) }} {{ donation.type }}
                </div>
                <div class="status-badge accepted">Accepted</div>
              </div>
              
              <div class="donation-details">
                <div class="detail-row">
                  <span class="label">Donor:</span>
                  <span class="value">{{ donation.donor?.name || 'Anonymous' }}</span>
                </div>
                <div class="detail-row" *ngIf="donation.type === 'MONEY'">
                  <span class="label">Amount:</span>
                  <span class="value amount">₹{{ donation.amount }}</span>
                </div>
                <div class="detail-row" *ngIf="donation.pickupRequired">
                  <span class="label">Pickup Address:</span>
                  <span class="value">{{ donation.pickupAddress }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Accepted On:</span>
                  <span class="value">{{ donation.updatedAt | date:'medium' }}</span>
                </div>
              </div>

              <div class="donation-actions">
                <button class="btn-complete" (click)="completeDonation(donation._id)">
                  ✅ Mark as Completed
                </button>
              </div>
            </div>
          </div>
          <ng-template #noAccepted>
            <div class="empty-state">
              <div class="empty-icon">📋</div>
              <h3>No Accepted Donations</h3>
              <p>Donations you accept will appear here</p>
            </div>
          </ng-template>
        </div>

        <!-- Completed Donations Tab -->
        <div class="tab-content" *ngIf="activeTab === 'completed'">
          <div class="donations-list" *ngIf="completedDonations.length > 0; else noCompleted">
            <div class="donation-card completed-card" *ngFor="let donation of completedDonations">
              <div class="donation-header">
                <div class="donation-type" [class]="donation.type.toLowerCase()">
                  {{ getDonationIcon(donation.type) }} {{ donation.type }}
                </div>
                <div class="status-badge completed">✅ Completed</div>
              </div>
              
              <div class="donation-details">
                <div class="detail-row">
                  <span class="label">Donor:</span>
                  <span class="value">{{ donation.donor?.name || 'Anonymous' }}</span>
                </div>
                <div class="detail-row" *ngIf="donation.type === 'MONEY'">
                  <span class="label">Amount:</span>
                  <span class="value amount">₹{{ donation.amount }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Completed On:</span>
                  <span class="value">{{ donation.updatedAt | date:'medium' }}</span>
                </div>
              </div>
            </div>
          </div>
          <ng-template #noCompleted>
            <div class="empty-state">
              <div class="empty-icon">🎯</div>
              <h3>No Completed Donations</h3>
              <p>Completed donations will be shown here</p>
            </div>
          </ng-template>
        </div>

        <!-- Profile Tab -->
        <div class="tab-content profile-content" *ngIf="activeTab === 'profile'">
          <div class="profile-card" *ngIf="ngoProfile">
            <div class="profile-header">
              <div class="profile-avatar">{{ ngoProfile.organizationName?.charAt(0) }}</div>
              <div>
                <h2>{{ ngoProfile.organizationName }}</h2>
                <p class="verification-status" [class.verified]="ngoProfile.verified">
                  {{ ngoProfile.verified ? '✓ Verified Organization' : '⏳ Verification Pending' }}
                </p>
              </div>
            </div>

            <div class="profile-section">
              <h3>📋 Basic Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Registration Number:</span>
                  <span class="info-value">{{ ngoProfile.registrationNumber }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Year Established:</span>
                  <span class="info-value">{{ ngoProfile.yearEstablished }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Website:</span>
                  <span class="info-value">
                    <a [href]="ngoProfile.website" target="_blank">{{ ngoProfile.website || 'N/A' }}</a>
                  </span>
                </div>
                <div class="info-item">
                  <span class="info-label">Contact Phone:</span>
                  <span class="info-value">{{ ngoProfile.contactPhone }}</span>
                </div>
              </div>
            </div>

            <div class="profile-section">
              <h3>📍 Location</h3>
              <p class="address">
                {{ ngoProfile.address?.street }}<br>
                {{ ngoProfile.address?.city }}, {{ ngoProfile.address?.state }} - {{ ngoProfile.address?.pincode }}
              </p>
            </div>

            <div class="profile-section">
              <h3>🎯 Focus Areas</h3>
              <div class="focus-areas">
                <span class="focus-badge" *ngFor="let area of ngoProfile.focusAreas">
                  {{ area }}
                </span>
              </div>
            </div>

            <div class="profile-section">
              <h3>📝 Description</h3>
              <p class="description">{{ ngoProfile.description }}</p>
            </div>

            <div class="profile-section" *ngIf="ngoProfile.verificationNotes">
              <h3>📌 Verification Notes</h3>
              <p class="notes">{{ ngoProfile.verificationNotes }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Dark Theme NGO Dashboard */
    .ngo-dashboard {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
      color: #e4e4e4;
    }

    /* Header */
    .ngo-header {
      background: rgba(255, 255, 255, 0.05);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .logo-icon {
      font-size: 3rem;
    }

    .org-info h1 {
      margin: 0;
      font-size: 1.8rem;
      color: #fff;
    }

    .verification-badge {
      margin: 0.25rem 0 0 0;
      font-size: 0.9rem;
      color: #ffa726;
    }

    .verification-badge.verified {
      color: #66bb6a;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-name {
      color: #e0e0e0;
      font-size: 0.95rem;
    }

    .btn-logout {
      padding: 0.6rem 1.5rem;
      background: linear-gradient(135deg, #e53935 0%, #c62828 100%);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-logout:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(229, 57, 53, 0.4);
    }

    /* Dashboard Container */
    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.3s;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }

    .stat-card.pending {
      border-left: 4px solid #ffa726;
    }

    .stat-card.accepted {
      border-left: 4px solid #42a5f5;
    }

    .stat-card.completed {
      border-left: 4px solid #66bb6a;
    }

    .stat-card.total-amount {
      border-left: 4px solid #ab47bc;
    }

    .stat-icon {
      font-size: 2.5rem;
    }

    .stat-details h3 {
      margin: 0;
      font-size: 2rem;
      color: #fff;
    }

    .stat-details p {
      margin: 0.25rem 0 0 0;
      color: #b0b0b0;
      font-size: 0.9rem;
    }

    /* Tabs */
    .tabs {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      border-bottom: 2px solid rgba(255, 255, 255, 0.1);
      flex-wrap: wrap;
    }

    .tab-btn {
      padding: 1rem 2rem;
      background: transparent;
      color: #b0b0b0;
      border: none;
      border-bottom: 3px solid transparent;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 600;
      transition: all 0.3s;
    }

    .tab-btn:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.05);
    }

    .tab-btn.active {
      color: #fff;
      border-bottom-color: #00d4ff;
      background: rgba(0, 212, 255, 0.1);
    }

    /* Tab Content */
    .tab-content {
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Donations List */
    .donations-list {
      display: grid;
      gap: 1.5rem;
    }

    .donation-card {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      transition: all 0.3s;
    }

    .donation-card:hover {
      transform: translateX(4px);
      border-color: rgba(0, 212, 255, 0.3);
      box-shadow: 0 4px 16px rgba(0, 212, 255, 0.2);
    }

    .donation-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .donation-type {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .donation-type.money {
      background: rgba(171, 71, 188, 0.2);
      color: #ce93d8;
    }

    .donation-type.food {
      background: rgba(255, 167, 38, 0.2);
      color: #ffb74d;
    }

    .donation-type.clothes {
      background: rgba(66, 165, 245, 0.2);
      color: #64b5f6;
    }

    .donation-type.books {
      background: rgba(102, 187, 106, 0.2);
      color: #81c784;
    }

    .donation-type.other {
      background: rgba(120, 120, 120, 0.2);
      color: #bdbdbd;
    }

    .donation-date {
      color: #b0b0b0;
      font-size: 0.85rem;
    }

    .status-badge {
      padding: 0.4rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .status-badge.accepted {
      background: rgba(66, 165, 245, 0.2);
      color: #64b5f6;
    }

    .status-badge.completed {
      background: rgba(102, 187, 106, 0.2);
      color: #81c784;
    }

    /* Donation Details */
    .donation-details {
      margin: 1rem 0;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .label {
      color: #b0b0b0;
      font-size: 0.9rem;
    }

    .value {
      color: #fff;
      font-weight: 500;
      text-align: right;
    }

    .value.amount {
      color: #ab47bc;
      font-size: 1.2rem;
      font-weight: 700;
    }

    /* Donation Actions */
    .donation-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .btn-accept, .btn-reject, .btn-complete {
      flex: 1;
      padding: 0.8rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-accept {
      background: linear-gradient(135deg, #66bb6a 0%, #43a047 100%);
      color: white;
    }

    .btn-accept:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 187, 106, 0.4);
    }

    .btn-reject {
      background: linear-gradient(135deg, #ef5350 0%, #d32f2f 100%);
      color: white;
    }

    .btn-reject:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(239, 83, 80, 0.4);
    }

    .btn-complete {
      background: linear-gradient(135deg, #42a5f5 0%, #1976d2 100%);
      color: white;
    }

    .btn-complete:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(66, 165, 245, 0.4);
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .empty-icon {
      font-size: 5rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-state h3 {
      color: #fff;
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: #b0b0b0;
    }

    /* Profile Content */
    .profile-content {
      max-width: 900px;
    }

    .profile-card {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
    }

    .profile-header {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    }

    .profile-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      color: white;
      font-weight: bold;
    }

    .profile-header h2 {
      margin: 0;
      color: #fff;
    }

    .verification-status {
      margin: 0.5rem 0 0 0;
      font-size: 0.9rem;
      color: #ffa726;
    }

    .verification-status.verified {
      color: #66bb6a;
    }

    .profile-section {
      margin: 2rem 0;
    }

    .profile-section h3 {
      color: #fff;
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .info-label {
      color: #b0b0b0;
      font-size: 0.85rem;
    }

    .info-value {
      color: #fff;
      font-weight: 500;
    }

    .info-value a {
      color: #64b5f6;
      text-decoration: none;
    }

    .info-value a:hover {
      text-decoration: underline;
    }

    .address, .description, .notes {
      color: #e0e0e0;
      line-height: 1.6;
    }

    .focus-areas {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .focus-badge {
      padding: 0.5rem 1rem;
      background: rgba(0, 212, 255, 0.2);
      color: #00d4ff;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .header-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .tabs {
        flex-direction: column;
      }

      .donation-actions {
        flex-direction: column;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class NgoDashboardComponent implements OnInit {
  user = this.auth.getUser();
  ngoProfile: any = null;
  activeTab: 'pending' | 'accepted' | 'completed' | 'profile' = 'pending';
  
  allDonations: any[] = [];
  pendingDonations: any[] = [];
  acceptedDonations: any[] = [];
  completedDonations: any[] = [];
  totalAmount = 0;

  constructor(
    private auth: AuthService, 
    private http: HttpClient, 
    private router: Router
  ) {}

  ngOnInit() {
    this.loadNGOProfile();
    this.loadDonations();
  }

  loadNGOProfile() {
    const token = localStorage.getItem('dc_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any>('/api/ngo/profile', { headers }).subscribe({
      next: (profile) => {
        this.ngoProfile = profile;
      },
      error: (err) => console.error('Failed to load NGO profile:', err)
    });
  }

  loadDonations() {
    const token = localStorage.getItem('dc_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Load all donations for this NGO
    this.http.get<any[]>('/api/donations/ngo', { headers }).subscribe({
      next: (donations) => {
        this.allDonations = donations;
        this.filterDonations();
        this.calculateStats();
      },
      error: (err) => console.error('Failed to load donations:', err)
    });
  }

  filterDonations() {
    this.pendingDonations = this.allDonations.filter(d => d.status === 'PENDING');
    this.acceptedDonations = this.allDonations.filter(d => d.status === 'ACCEPTED');
    this.completedDonations = this.allDonations.filter(d => d.status === 'COMPLETED');
  }

  calculateStats() {
    this.totalAmount = this.allDonations
      .filter(d => d.type === 'MONEY' && (d.status === 'ACCEPTED' || d.status === 'COMPLETED'))
      .reduce((sum, d) => sum + (d.amount || 0), 0);
  }

  acceptDonation(id: string) {
    if (!confirm('Accept this donation?')) return;

    const token = localStorage.getItem('dc_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.patch(`/api/donations/${id}`, { status: 'ACCEPTED' }, { headers }).subscribe({
      next: () => {
        alert('Donation accepted successfully!');
        this.loadDonations();
      },
      error: (err) => {
        console.error('Failed to accept donation:', err);
        alert('Failed to accept donation');
      }
    });
  }

  rejectDonation(id: string) {
    if (!confirm('Are you sure you want to decline this donation?')) return;

    const token = localStorage.getItem('dc_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.patch(`/api/donations/${id}`, { status: 'REJECTED' }, { headers }).subscribe({
      next: () => {
        alert('Donation declined');
        this.loadDonations();
      },
      error: (err) => {
        console.error('Failed to reject donation:', err);
        alert('Failed to decline donation');
      }
    });
  }

  completeDonation(id: string) {
    if (!confirm('Mark this donation as completed?')) return;

    const token = localStorage.getItem('dc_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.patch(`/api/donations/${id}`, { status: 'COMPLETED' }, { headers }).subscribe({
      next: () => {
        alert('Donation marked as completed!');
        this.loadDonations();
      },
      error: (err) => {
        console.error('Failed to complete donation:', err);
        alert('Failed to complete donation');
      }
    });
  }

  getDonationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'MONEY': '💰',
      'FOOD': '🍲',
      'CLOTHES': '👕',
      'BOOKS': '📚',
      'OTHER': '📦'
    };
    return icons[type] || '📦';
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
