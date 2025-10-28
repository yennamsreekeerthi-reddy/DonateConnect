import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-dashboard">
      <!-- Header -->
      <header class="admin-header">
        <div class="header-content">
          <div class="logo-section">
            <span class="logo-icon">🔐</span>
            <h1>Admin Portal</h1>
          </div>
          <div class="user-section">
            <span class="user-info">
              <span class="user-icon">👤</span>
              {{ user?.name }}
            </span>
            <button class="logout-btn" (click)="logout()">
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </header>

      <!-- Stats Dashboard -->
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-icon pending">⏳</div>
          <div class="stat-info">
            <h3>{{ pendingNgos.length }}</h3>
            <p>Pending Verifications</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon verified">✅</div>
          <div class="stat-info">
            <h3>{{ verifiedNgos.length }}</h3>
            <p>Verified NGOs</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon rejected">❌</div>
          <div class="stat-info">
            <h3>{{ rejectedNgos.length }}</h3>
            <p>Rejected NGOs</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon total">📊</div>
          <div class="stat-info">
            <h3>{{ pendingNgos.length + verifiedNgos.length + rejectedNgos.length }}</h3>
            <p>Total Applications</p>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs-container">
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'pending'"
          (click)="activeTab = 'pending'"
        >
          ⏳ Pending ({{ pendingNgos.length }})
        </button>
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'verified'"
          (click)="activeTab = 'verified'"
        >
          ✅ Verified ({{ verifiedNgos.length }})
        </button>
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'rejected'"
          (click)="activeTab = 'rejected'"
        >
          ❌ Rejected ({{ rejectedNgos.length }})
        </button>
      </div>

      <!-- NGO List -->
      <div class="ngo-list-container">
        <!-- Pending NGOs -->
        <div *ngIf="activeTab === 'pending'">
          <div *ngIf="pendingNgos.length === 0" class="empty-state">
            <span class="empty-icon">📭</span>
            <h3>No Pending Verifications</h3>
            <p>All NGO applications have been processed</p>
          </div>

          <div class="ngo-card" *ngFor="let ngo of pendingNgos">
            <div class="ngo-header">
              <div class="ngo-avatar">
                {{ ngo.organizationName?.charAt(0) || 'N' }}
              </div>
              <div class="ngo-title">
                <h3>{{ ngo.organizationName }}</h3>
                <span class="status-badge pending">Pending Verification</span>
              </div>
            </div>

            <div class="ngo-details">
              <div class="detail-row">
                <span class="detail-label">📧 Email:</span>
                <span class="detail-value">{{ ngo.user?.email || ngo.email }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">📞 Phone:</span>
                <span class="detail-value">{{ ngo.contactPhone }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">📝 Registration No:</span>
                <span class="detail-value">{{ ngo.registrationNumber }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">📅 Established:</span>
                <span class="detail-value">{{ ngo.yearEstablished }}</span>
              </div>
              <div class="detail-row" *ngIf="ngo.website">
                <span class="detail-label">🌐 Website:</span>
                <span class="detail-value">
                  <a [href]="ngo.website" target="_blank">{{ ngo.website }}</a>
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">📍 Address:</span>
                <span class="detail-value">{{ ngo.address }}, {{ ngo.city }}, {{ ngo.state }} - {{ ngo.pincode }}</span>
              </div>
              <div class="detail-row" *ngIf="ngo.focusAreas && ngo.focusAreas.length > 0">
                <span class="detail-label">🎯 Focus Areas:</span>
                <span class="focus-areas">
                  <span class="focus-tag" *ngFor="let area of ngo.focusAreas">{{ area }}</span>
                </span>
              </div>
              <div class="detail-row description">
                <span class="detail-label">📋 Description:</span>
                <p class="detail-value">{{ ngo.description }}</p>
              </div>
            </div>

            <div class="ngo-actions">
              <button class="action-btn approve-btn" (click)="verifyNgo(ngo._id)">
                <span>✅</span> Approve & Verify
              </button>
              <button class="action-btn reject-btn" (click)="openRejectModal(ngo)">
                <span>❌</span> Reject
              </button>
            </div>
          </div>
        </div>

        <!-- Verified NGOs -->
        <div *ngIf="activeTab === 'verified'">
          <div *ngIf="verifiedNgos.length === 0" class="empty-state">
            <span class="empty-icon">✅</span>
            <h3>No Verified NGOs Yet</h3>
            <p>Verified NGOs will appear here</p>
          </div>

          <div class="ngo-card verified" *ngFor="let ngo of verifiedNgos">
            <div class="ngo-header">
              <div class="ngo-avatar verified-avatar">
                {{ ngo.organizationName?.charAt(0) || 'N' }}
              </div>
              <div class="ngo-title">
                <h3>{{ ngo.organizationName }}</h3>
                <span class="status-badge verified">✅ Verified</span>
              </div>
            </div>

            <div class="ngo-details">
              <div class="detail-row">
                <span class="detail-label">📧 Email:</span>
                <span class="detail-value">{{ ngo.user?.email || ngo.email }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">📞 Phone:</span>
                <span class="detail-value">{{ ngo.contactPhone }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">📝 Registration No:</span>
                <span class="detail-value">{{ ngo.registrationNumber }}</span>
              </div>
              <div class="detail-row" *ngIf="ngo.focusAreas && ngo.focusAreas.length > 0">
                <span class="detail-label">🎯 Focus Areas:</span>
                <span class="focus-areas">
                  <span class="focus-tag" *ngFor="let area of ngo.focusAreas">{{ area }}</span>
                </span>
              </div>
            </div>

            <div class="ngo-actions">
              <button class="action-btn revoke-btn" (click)="revokeVerification(ngo._id)">
                <span>🚫</span> Revoke Verification
              </button>
            </div>
          </div>
        </div>

        <!-- Rejected NGOs -->
        <div *ngIf="activeTab === 'rejected'">
          <div *ngIf="rejectedNgos.length === 0" class="empty-state">
            <span class="empty-icon">❌</span>
            <h3>No Rejected Applications</h3>
            <p>Rejected NGOs will appear here</p>
          </div>

          <div class="ngo-card rejected" *ngFor="let ngo of rejectedNgos">
            <div class="ngo-header">
              <div class="ngo-avatar rejected-avatar">
                {{ ngo.organizationName?.charAt(0) || 'N' }}
              </div>
              <div class="ngo-title">
                <h3>{{ ngo.organizationName }}</h3>
                <span class="status-badge rejected">❌ Rejected</span>
              </div>
            </div>

            <div class="ngo-details">
              <div class="detail-row">
                <span class="detail-label">📧 Email:</span>
                <span class="detail-value">{{ ngo.user?.email || ngo.email }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">📞 Phone:</span>
                <span class="detail-value">{{ ngo.contactPhone }}</span>
              </div>
              <div class="detail-row" *ngIf="ngo.verificationNotes">
                <span class="detail-label">📝 Rejection Reason:</span>
                <p class="detail-value rejection-note">{{ ngo.verificationNotes }}</p>
              </div>
            </div>

            <div class="ngo-actions">
              <button class="action-btn approve-btn" (click)="verifyNgo(ngo._id)">
                <span>✅</span> Reconsider & Approve
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Reject Modal -->
      <div class="modal-overlay" *ngIf="showRejectModal" (click)="closeRejectModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Reject NGO Application</h2>
            <button class="modal-close" (click)="closeRejectModal()">✕</button>
          </div>
          <div class="modal-body">
            <p>You are about to reject: <strong>{{ selectedNgo?.organizationName }}</strong></p>
            <div class="form-group">
              <label>Reason for Rejection</label>
              <textarea 
                [(ngModel)]="rejectionNotes"
                placeholder="Please provide a reason for rejection (this will be sent to the NGO)..."
                rows="4"
                required
              ></textarea>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn-cancel" (click)="closeRejectModal()">Cancel</button>
            <button class="btn-reject" (click)="confirmReject()" [disabled]="!rejectionNotes">
              Reject Application
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Dark Theme Admin Dashboard */
    .admin-dashboard {
      min-height: 100vh;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #e4e4e4;
    }

    /* Header */
    .admin-header {
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
      font-size: 2rem;
    }

    .logo-section h1 {
      font-size: 1.8rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0;
    }

    .user-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 50px;
      font-weight: 500;
    }

    .user-icon {
      font-size: 1.2rem;
    }

    .logout-btn {
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      border: none;
      border-radius: 50px;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .logout-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(245, 87, 108, 0.4);
    }

    /* Stats Container */
    .stats-container {
      max-width: 1400px;
      margin: 2rem auto;
      padding: 0 2rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
    }

    .stat-icon.pending {
      background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
    }

    .stat-icon.verified {
      background: linear-gradient(135deg, #55efc4, #00b894);
    }

    .stat-icon.rejected {
      background: linear-gradient(135deg, #ff7675, #d63031);
    }

    .stat-icon.total {
      background: linear-gradient(135deg, #667eea, #764ba2);
    }

    .stat-info h3 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 0.25rem 0;
      color: #fff;
    }

    .stat-info p {
      margin: 0;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
    }

    /* Tabs */
    .tabs-container {
      max-width: 1400px;
      margin: 2rem auto 1rem;
      padding: 0 2rem;
      display: flex;
      gap: 1rem;
    }

    .tab-btn {
      padding: 0.875rem 1.75rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 50px;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .tab-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    .tab-btn.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-color: transparent;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }

    /* NGO List */
    .ngo-list-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1rem 2rem 3rem;
    }

    .ngo-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 2rem;
      margin-bottom: 1.5rem;
      transition: all 0.3s ease;
    }

    .ngo-card:hover {
      transform: translateX(5px);
      border-color: rgba(102, 126, 234, 0.5);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .ngo-card.verified {
      border-left: 4px solid #00b894;
    }

    .ngo-card.rejected {
      border-left: 4px solid #d63031;
    }

    .ngo-header {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .ngo-avatar {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 700;
      color: white;
    }

    .ngo-avatar.verified-avatar {
      background: linear-gradient(135deg, #55efc4, #00b894);
    }

    .ngo-avatar.rejected-avatar {
      background: linear-gradient(135deg, #ff7675, #d63031);
    }

    .ngo-title h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      color: #fff;
    }

    .status-badge {
      padding: 0.5rem 1rem;
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: 600;
      display: inline-block;
    }

    .status-badge.pending {
      background: rgba(253, 203, 110, 0.2);
      color: #fdcb6e;
      border: 1px solid rgba(253, 203, 110, 0.3);
    }

    .status-badge.verified {
      background: rgba(85, 239, 196, 0.2);
      color: #55efc4;
      border: 1px solid rgba(85, 239, 196, 0.3);
    }

    .status-badge.rejected {
      background: rgba(255, 118, 117, 0.2);
      color: #ff7675;
      border: 1px solid rgba(255, 118, 117, 0.3);
    }

    .ngo-details {
      display: grid;
      gap: 1rem;
    }

    .detail-row {
      display: flex;
      gap: 1rem;
      padding: 0.75rem 0;
    }

    .detail-row.description {
      flex-direction: column;
    }

    .detail-label {
      min-width: 150px;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 600;
    }

    .detail-value {
      color: #e4e4e4;
      flex: 1;
    }

    .detail-value a {
      color: #667eea;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .detail-value a:hover {
      color: #764ba2;
      text-decoration: underline;
    }

    .focus-areas {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .focus-tag {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
      border: 1px solid rgba(102, 126, 234, 0.3);
      padding: 0.5rem 1rem;
      border-radius: 50px;
      font-size: 0.85rem;
      color: #667eea;
      font-weight: 500;
    }

    .rejection-note {
      background: rgba(255, 118, 117, 0.1);
      padding: 1rem;
      border-radius: 8px;
      border-left: 3px solid #d63031;
      color: #ff7675;
    }

    .ngo-actions {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      gap: 1rem;
    }

    .action-btn {
      padding: 0.875rem 1.75rem;
      border: none;
      border-radius: 50px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
    }

    .approve-btn {
      background: linear-gradient(135deg, #55efc4, #00b894);
      color: white;
    }

    .approve-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 184, 148, 0.4);
    }

    .reject-btn {
      background: linear-gradient(135deg, #ff7675, #d63031);
      color: white;
    }

    .reject-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(214, 48, 49, 0.4);
    }

    .revoke-btn {
      background: linear-gradient(135deg, #fdcb6e, #e17055);
      color: white;
    }

    .revoke-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(225, 112, 85, 0.4);
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 20px;
      border: 2px dashed rgba(255, 255, 255, 0.1);
    }

    .empty-icon {
      font-size: 4rem;
      display: block;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      margin: 0 0 0.5rem 0;
      color: #fff;
      font-size: 1.5rem;
    }

    .empty-state p {
      color: rgba(255, 255, 255, 0.5);
      margin: 0;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(5px);
    }

    .modal-content {
      background: #1a1a2e;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h2 {
      margin: 0;
      color: #fff;
      font-size: 1.5rem;
    }

    .modal-close {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.7);
      font-size: 1.5rem;
      cursor: pointer;
      transition: color 0.3s ease;
      padding: 0;
      width: 30px;
      height: 30px;
    }

    .modal-close:hover {
      color: #fff;
    }

    .modal-body {
      padding: 2rem;
    }

    .modal-body p {
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .form-group textarea {
      width: 100%;
      padding: 0.875rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: #fff;
      font-size: 1rem;
      font-family: inherit;
      resize: vertical;
    }

    .form-group textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .modal-actions {
      padding: 1.5rem 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .btn-cancel {
      padding: 0.875rem 1.75rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 50px;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-cancel:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    .btn-reject {
      padding: 0.875rem 1.75rem;
      background: linear-gradient(135deg, #ff7675, #d63031);
      border: none;
      border-radius: 50px;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-reject:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(214, 48, 49, 0.4);
    }

    .btn-reject:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .stats-container {
        grid-template-columns: 1fr;
      }

      .tabs-container {
        flex-direction: column;
      }

      .ngo-actions {
        flex-direction: column;
      }

      .action-btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  user = this.auth.getUser();
  pendingNgos: any[] = [];
  verifiedNgos: any[] = [];
  rejectedNgos: any[] = [];
  activeTab: 'pending' | 'verified' | 'rejected' = 'pending';
  
  showRejectModal = false;
  selectedNgo: any = null;
  rejectionNotes = '';

  constructor(
    private auth: AuthService, 
    private http: HttpClient, 
    private router: Router
  ) {}

  ngOnInit() {
    this.loadNGOs();
  }

  loadNGOs() {
    const token = localStorage.getItem('dc_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Load all NGOs
    this.http.get<any[]>('/api/ngo', { headers }).subscribe({
      next: (ngos) => {
        this.pendingNgos = ngos.filter(n => n.verificationStatus === 'PENDING');
        this.verifiedNgos = ngos.filter(n => n.verificationStatus === 'APPROVED' && n.verified);
        this.rejectedNgos = ngos.filter(n => n.verificationStatus === 'REJECTED');
      },
      error: (err) => console.error('Failed to load NGOs:', err)
    });
  }

  verifyNgo(id: string) {
    if (!confirm('Are you sure you want to verify this NGO?')) return;

    const token = localStorage.getItem('dc_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.patch(`/api/ngo/${id}`, {
      verified: true,
      verificationStatus: 'APPROVED',
      verificationNotes: 'Verified by admin'
    }, { headers }).subscribe({
      next: () => {
        alert('NGO verified successfully!');
        this.loadNGOs();
      },
      error: (err) => {
        console.error('Failed to verify NGO:', err);
        alert('Failed to verify NGO');
      }
    });
  }

  openRejectModal(ngo: any) {
    this.selectedNgo = ngo;
    this.showRejectModal = true;
    this.rejectionNotes = '';
  }

  closeRejectModal() {
    this.showRejectModal = false;
    this.selectedNgo = null;
    this.rejectionNotes = '';
  }

  confirmReject() {
    if (!this.selectedNgo || !this.rejectionNotes.trim()) return;

    const token = localStorage.getItem('dc_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.patch(`/api/ngo/${this.selectedNgo._id}`, {
      verified: false,
      verificationStatus: 'REJECTED',
      verificationNotes: this.rejectionNotes
    }, { headers }).subscribe({
      next: () => {
        alert('NGO application rejected');
        this.closeRejectModal();
        this.loadNGOs();
      },
      error: (err) => {
        console.error('Failed to reject NGO:', err);
        alert('Failed to reject NGO');
      }
    });
  }

  revokeVerification(id: string) {
    if (!confirm('Are you sure you want to revoke verification for this NGO?')) return;

    const token = localStorage.getItem('dc_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.patch(`/api/ngo/${id}`, {
      verified: false,
      verificationStatus: 'PENDING',
      verificationNotes: 'Verification revoked by admin'
    }, { headers }).subscribe({
      next: () => {
        alert('Verification revoked');
        this.loadNGOs();
      },
      error: (err) => {
        console.error('Failed to revoke verification:', err);
        alert('Failed to revoke verification');
      }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
