import { Component, OnInit, AfterViewInit, OnDestroy, PLATFORM_ID, Inject, ViewChild, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UPI_QR_IMAGE_URL } from '../../config/payment-qr.config';
import QRCode from 'qrcode';

declare const particlesJS: any;

@Component({
  selector: 'app-nearby-ngos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="nearby-page" (mousemove)="onMouseMove($event)">
      <div id="particles-js"></div>
      
      <div class="floating-shapes">
        <div class="shape shape-1">📍</div>
        <div class="shape shape-2">🏢</div>
        <div class="shape shape-3">🌍</div>
        <div class="shape shape-4">🎯</div>
      </div>

      <div class="nearby-container">
        <div class="header-section">
          <div class="header-content">
            <h1 class="page-title">Find NGOs Near You</h1>
            <p class="page-subtitle">Discover verified organizations in your area making a real difference</p>
            
            <button 
              class="locate-btn" 
              (click)="findNearby()"
              (mouseenter)="createParticles($event)"
              [disabled]="loading"
            >
              <span class="btn-icon">📍</span>
              <span class="btn-text">{{ loading ? 'Locating...' : 'Find NGOs Near Me' }}</span>
              <span class="btn-arrow">→</span>
            </button>

            <div class="location-info" *ngIf="currentLocation">
              <span class="info-icon">📌</span>
              <span>Searching verified NGOs across India</span>
            </div>
          </div>
        </div>

        <div class="error-message" *ngIf="error">
          <div class="error-icon">⚠️</div>
          <p>{{ error }}</p>
        </div>

        <div class="results-section" *ngIf="ngos.length > 0">
          <div class="results-header">
            <h2>Found {{ filteredNgos.length }} NGO{{ filteredNgos.length !== 1 ? 's' : '' }}</h2>
            <div class="filter-options">
              <button 
                class="filter-btn" 
                [class.active]="selectedFilter === 'All'"
                (click)="filterByCategory('All')">
                All
              </button>
              <button 
                class="filter-btn" 
                [class.active]="selectedFilter === 'Education'"
                (click)="filterByCategory('Education')">
                📚 Education
              </button>
              <button 
                class="filter-btn" 
                [class.active]="selectedFilter === 'Health'"
                (click)="filterByCategory('Health')">
                🏥 Health
              </button>
              <button 
                class="filter-btn" 
                [class.active]="selectedFilter === 'Environment'"
                (click)="filterByCategory('Environment')">
                🌱 Environment
              </button>
              <button 
                class="filter-btn" 
                [class.active]="selectedFilter === 'Women Empowerment'"
                (click)="filterByCategory('Women Empowerment')">
                👩 Women
              </button>
              <button 
                class="filter-btn" 
                [class.active]="selectedFilter === 'Child Welfare'"
                (click)="filterByCategory('Child Welfare')">
                👶 Child
              </button>
              <button 
                class="filter-btn" 
                [class.active]="selectedFilter === 'Animal Welfare'"
                (click)="filterByCategory('Animal Welfare')">
                🐾 Animal
              </button>
            </div>
          </div>

          <div class="ngos-grid">
            <div 
              class="ngo-card" 
              *ngFor="let ngo of filteredNgos; let i = index"
              (mouseenter)="createParticles($event)"
              [style.animation-delay]="i * 0.1 + 's'"
            >
              <div class="card-badge verified">
                <span class="badge-icon">✓</span>
                <span>Verified</span>
              </div>

              <div class="ngo-header">
                <div class="ngo-avatar">
                  <span class="avatar-icon">🏛️</span>
                </div>
                <div class="ngo-info">
                  <h3 class="ngo-name">{{ ngo.organizationName }}</h3>
                  <div class="ngo-distance" *ngIf="ngo.distance">
                    <span class="distance-icon">📍</span>
                    <span>{{ ngo.distance.toFixed(1) }} km away</span>
                  </div>
                </div>
              </div>

              <div class="ngo-details">
                <div class="detail-item" *ngIf="ngo.focusAreas && ngo.focusAreas.length > 0">
                  <span class="detail-icon">🎯</span>
                  <span class="focus-areas">
                    <span class="focus-badge" *ngFor="let area of ngo.focusAreas">{{ area }}</span>
                  </span>
                </div>
                <div class="detail-item" *ngIf="ngo.description">
                  <span class="detail-icon">�</span>
                  <span>{{ ngo.description }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">�📧</span>
                  <span>{{ ngo.user?.email || ngo.email || 'N/A' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">📞</span>
                  <span>{{ ngo.contactPhone || 'N/A' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">📍</span>
                  <span>{{ ngo.address || 'N/A' }}</span>
                </div>
              </div>

              <div class="ngo-stats">
                <div class="stat">
                  <div class="stat-value">{{ (Math.random() * 100 + 50) | number:'1.0-0' }}</div>
                  <div class="stat-label">Donations</div>
                </div>
                <div class="stat">
                  <div class="stat-value">₹{{ (Math.random() * 500000 + 100000) | number:'1.0-0' }}</div>
                  <div class="stat-label">Raised</div>
                </div>
                <div class="stat">
                  <div class="stat-value">{{ (Math.random() * 50 + 10) | number:'1.0-0' }}</div>
                  <div class="stat-label">Projects</div>
                </div>
              </div>

              <div class="ngo-actions">
                <button class="action-btn primary" (mouseenter)="createParticles($event)" (click)="openDonateModal(ngo)">
                  <span>Donate Now</span>
                  <span>💝</span>
                </button>
                <button class="action-btn secondary" (mouseenter)="createParticles($event)" (click)="viewNgoDetails(ngo)">
                  <span>View Details</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="!loading && ngos.length === 0 && !error && !currentLocation">
          <div class="empty-icon">🔍</div>
          <h3>Ready to Discover NGOs?</h3>
          <p>Click the button above to find verified organizations near your location</p>
          <div class="features-list">
            <div class="feature">✓ Real-time location-based search</div>
            <div class="feature">✓ 100% verified organizations</div>
            <div class="feature">✓ Direct donation options</div>
            <div class="feature">✓ Transparent impact tracking</div>
          </div>
        </div>

        <div class="no-results" *ngIf="!loading && ngos.length === 0 && currentLocation && !error">
          <div class="no-results-icon">😔</div>
          <h3>No NGOs Found</h3>
          <p>We could not find any verified NGOs. Our demo NGOs are located in Delhi, Mumbai, and Bangalore.</p>
          <button class="retry-btn" (click)="findNearby()">Try Again</button>
        </div>
      </div>

      <!-- Donation Modal -->
      <div class="modal-overlay" *ngIf="showDonateModal" (click)="closeDonateModal()">
        <div class="modal-content" (click)="$event.stopPropagation()" (mouseenter)="createParticles($event)">
          <button class="modal-close" (click)="closeDonateModal()">✕</button>
          
          <div class="modal-header">
            <div class="modal-icon">💝</div>
            <h2>Make a Donation</h2>
            <p class="modal-ngo-name">{{ selectedNgo?.organizationName }}</p>
          </div>

          <form class="donation-form" (submit)="submitDonation($event)">
            <div class="form-group">
              <label>Donation Type</label>
              <select [(ngModel)]="donationForm.type" name="type" required class="form-control">
                <option value="MONEY">Money</option>
                <option value="FOOD">Food</option>
                <option value="CLOTHES">Clothes</option>
                <option value="BOOKS">Books</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div class="form-group" *ngIf="donationForm.type === 'MONEY'">
              <label>Amount (₹)</label>
              <input 
                type="number" 
                [(ngModel)]="donationForm.amount" 
                name="amount" 
                placeholder="Enter amount"
                min="1"
                required
                class="form-control"
              />
            </div>

            <div class="form-group" *ngIf="donationForm.type !== 'MONEY'">
              <label>Description</label>
              <textarea 
                [(ngModel)]="donationForm.description" 
                name="description" 
                placeholder="Describe what you want to donate"
                rows="3"
                required
                class="form-control"
              ></textarea>
            </div>

            <div class="form-group">
              <label>Pickup Required?</label>
              <div class="radio-group">
                <label class="radio-label">
                  <input type="radio" [(ngModel)]="donationForm.pickupRequired" name="pickup" [value]="true" />
                  <span>Yes, I need pickup</span>
                </label>
                <label class="radio-label">
                  <input type="radio" [(ngModel)]="donationForm.pickupRequired" name="pickup" [value]="false" />
                  <span>No, I'll drop off</span>
                </label>
              </div>
            </div>

            <div class="form-group" *ngIf="donationForm.pickupRequired">
              <label>Pickup Address</label>
              <textarea 
                [(ngModel)]="donationForm.pickupAddress" 
                name="pickupAddress" 
                placeholder="Enter your address for pickup"
                rows="2"
                required
                class="form-control"
              ></textarea>
            </div>

            <div class="donation-summary" *ngIf="donationForm.type === 'MONEY' && donationForm.amount">
              <div class="summary-row">
                <span>Donation Amount:</span>
                <span class="amount">₹{{ donationForm.amount }}</span>
              </div>
              <div class="summary-row">
                <span>Processing Fee (2%):</span>
                <span>₹{{ getProcessingFee().toFixed(2) }}</span>
              </div>
              <div class="summary-row" *ngIf="donationForm.pickupRequired">
                <span>Shipping Charges:</span>
                <span>₹{{ getShippingCharge() }}</span>
              </div>
              <div class="summary-row total">
                <span>Total:</span>
                <span class="amount">₹{{ getTotalAmount().toFixed(2) }}</span>
              </div>
            </div>

            <div class="donation-summary" *ngIf="donationForm.type !== 'MONEY' && donationForm.pickupRequired">
              <div class="summary-row">
                <span>Item Donation</span>
                <span class="donation-type">{{ donationForm.type }}</span>
              </div>
              <div class="summary-row">
                <span>Shipping Charges:</span>
                <span class="amount">₹{{ getShippingCharge() }}</span>
              </div>
              <div class="summary-note">
                <span class="note-icon">ℹ️</span>
                <span>Shipping charges will be collected at the time of pickup</span>
              </div>
            </div>

            <div class="error-message" *ngIf="donationError">
              <div class="error-icon">⚠️</div>
              <p>{{ donationError }}</p>
            </div>

            <div class="success-message" *ngIf="donationSuccess">
              <div class="success-icon">✓</div>
              <p>Donation submitted successfully!</p>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-cancel" (click)="closeDonateModal()">Cancel</button>
              <button type="submit" class="btn-donate" [disabled]="donationSubmitting">
                <span *ngIf="!donationSubmitting">{{ donationForm.type === 'MONEY' ? 'Proceed to Payment' : 'Submit Donation' }}</span>
                <span *ngIf="donationSubmitting">Submitting...</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Payment Modal -->
      <div class="modal-overlay" *ngIf="showPaymentModal" (click)="closePaymentModal()">
        <div class="modal-content payment-modal" (click)="$event.stopPropagation()" (mouseenter)="createParticles($event)">
          <button class="modal-close" (click)="closePaymentModal()">✕</button>
          
          <div class="modal-header">
            <div class="modal-icon">💳</div>
            <h2>Complete Payment</h2>
            <p class="modal-ngo-name">{{ selectedNgo?.organizationName }}</p>
            <div class="payment-amount">₹{{ paymentAmount }}</div>
          </div>

          <!-- Payment Method Selection -->
          <div class="payment-methods" *ngIf="!selectedPaymentMethod">
            <h3 class="section-title">Choose Payment Method</h3>
            
            <div class="payment-options">
              <div 
                class="payment-option" 
                (click)="selectPaymentMethod('UPI')"
                (mouseenter)="createParticles($event)"
              >
                <div class="option-icon">📱</div>
                <div class="option-details">
                  <h4>UPI</h4>
                  <p>Pay using any UPI app</p>
                </div>
                <div class="option-arrow">→</div>
              </div>

              <div 
                class="payment-option" 
                (click)="selectPaymentMethod('CARD')"
                (mouseenter)="createParticles($event)"
              >
                <div class="option-icon">💳</div>
                <div class="option-details">
                  <h4>Credit/Debit Card</h4>
                  <p>Visa, Mastercard, Rupay</p>
                </div>
                <div class="option-arrow">→</div>
              </div>

              <div 
                class="payment-option" 
                (click)="selectPaymentMethod('NETBANKING')"
                (mouseenter)="createParticles($event)"
              >
                <div class="option-icon">🏦</div>
                <div class="option-details">
                  <h4>Net Banking</h4>
                  <p>All major banks supported</p>
                </div>
                <div class="option-arrow">→</div>
              </div>

              <div 
                class="payment-option" 
                (click)="selectPaymentMethod('WALLET')"
                (mouseenter)="createParticles($event)"
              >
                <div class="option-icon">👛</div>
                <div class="option-details">
                  <h4>Wallet</h4>
                  <p>Paytm, PhonePe, Google Pay</p>
                </div>
                <div class="option-arrow">→</div>
              </div>
            </div>
          </div>

          <!-- UPI Payment -->
          <div class="payment-details" *ngIf="selectedPaymentMethod === 'UPI'">
            <button class="back-btn" (click)="selectedPaymentMethod = null">← Back</button>
            
            <h3 class="section-title">UPI Payment</h3>
            
            <div class="upi-input-section">
              <label class="input-label">Enter Your UPI ID</label>
              <div class="upi-input-group">
                <input 
                  type="text" 
                  [(ngModel)]="userUpiId"
                  placeholder="yourname@paytm / yourname@googlep ay"
                  class="upi-input"
                  (ngModelChange)="onUpiIdChange()"
                />
                <button class="verify-btn" (click)="verifyUpiId()" [disabled]="!userUpiId">
                  Verify
                </button>
              </div>
              <p class="input-hint">💡 Enter your UPI ID to proceed with payment</p>
            </div>

            <div class="divider-text">
              <span>OR</span>
            </div>
            
            <div class="qr-section">
              <div class="qr-code">
                <ng-container *ngIf="qrImageUrl; else generatedQr">
         <img [src]="qrImageUrl" alt="UPI QR" style="width:250px;height:250px;border-radius:8px;"
           (error)="onQrImageError()" />
                </ng-container>
                <ng-template #generatedQr>
                  <canvas #qrCanvas></canvas>
                </ng-template>
              </div>
              <p class="qr-instruction">📱 Scan QR code with any UPI app</p>
              <div class="upi-id">
                <span class="label">Payee UPI ID:</span>
                <span class="value">{{ generatedUpiId }}</span>
                <button class="copy-btn" (click)="copyUpiId()">📋 Copy</button>
              </div>
            </div>

            <div class="payment-info">
              <div class="info-row">
                <span>Amount:</span>
                <span class="highlight">₹{{ paymentAmount }}</span>
              </div>
              <div class="info-row">
                <span>Beneficiary:</span>
                <span>{{ selectedNgo?.organizationName }}</span>
              </div>
            </div>

            <button 
              class="confirm-payment-btn" 
              (click)="confirmPayment()"
              (mouseenter)="createParticles($event)"
              [disabled]="paymentProcessing"
            >
              <span *ngIf="!paymentProcessing">✓ I have completed the payment</span>
              <span *ngIf="paymentProcessing">Processing...</span>
            </button>
          </div>

          <!-- Card Payment -->
          <div class="payment-details" *ngIf="selectedPaymentMethod === 'CARD'">
            <button class="back-btn" (click)="selectedPaymentMethod = null">← Back</button>
            
            <h3 class="section-title">Card Payment</h3>
            
            <div class="card-form">
              <div class="form-group">
                <label>Card Number</label>
                <input 
                  type="text" 
                  [(ngModel)]="cardDetails.number" 
                  placeholder="1234 5678 9012 3456"
                  maxlength="19"
                  class="form-control"
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Expiry Date</label>
                  <input 
                    type="text" 
                    [(ngModel)]="cardDetails.expiry" 
                    placeholder="MM/YY"
                    maxlength="5"
                    class="form-control"
                  />
                </div>
                <div class="form-group">
                  <label>CVV</label>
                  <input 
                    type="password" 
                    [(ngModel)]="cardDetails.cvv" 
                    placeholder="123"
                    maxlength="3"
                    class="form-control"
                  />
                </div>
              </div>

              <div class="form-group">
                <label>Cardholder Name</label>
                <input 
                  type="text" 
                  [(ngModel)]="cardDetails.name" 
                  placeholder="Name on card"
                  class="form-control"
                />
              </div>
            </div>

            <button 
              class="confirm-payment-btn" 
              (click)="confirmPayment()"
              (mouseenter)="createParticles($event)"
              [disabled]="paymentProcessing"
            >
              <span *ngIf="!paymentProcessing">Pay ₹{{ paymentAmount }}</span>
              <span *ngIf="paymentProcessing">Processing...</span>
            </button>
          </div>

          <!-- Net Banking -->
          <div class="payment-details" *ngIf="selectedPaymentMethod === 'NETBANKING'">
            <button class="back-btn" (click)="selectedPaymentMethod = null">← Back</button>
            
            <h3 class="section-title">Net Banking</h3>
            
            <div class="bank-selection">
              <div class="form-group">
                <label>Select Your Bank</label>
                <select [(ngModel)]="selectedBank" class="form-control">
                  <option value="">Choose a bank</option>
                  <option value="SBI">State Bank of India</option>
                  <option value="HDFC">HDFC Bank</option>
                  <option value="ICICI">ICICI Bank</option>
                  <option value="AXIS">Axis Bank</option>
                  <option value="PNB">Punjab National Bank</option>
                  <option value="BOB">Bank of Baroda</option>
                  <option value="KOTAK">Kotak Mahindra Bank</option>
                </select>
              </div>
            </div>

            <button 
              class="confirm-payment-btn" 
              (click)="confirmPayment()"
              (mouseenter)="createParticles($event)"
              [disabled]="paymentProcessing || !selectedBank"
            >
              <span *ngIf="!paymentProcessing">Continue to {{ selectedBank || 'Bank' }}</span>
              <span *ngIf="paymentProcessing">Processing...</span>
            </button>
          </div>

          <!-- Wallet Payment -->
          <div class="payment-details" *ngIf="selectedPaymentMethod === 'WALLET'">
            <button class="back-btn" (click)="selectedPaymentMethod = null">← Back</button>
            
            <h3 class="section-title">Wallet Payment</h3>
            
            <div class="wallet-selection">
              <div 
                class="wallet-option" 
                *ngFor="let wallet of walletOptions"
                [class.selected]="selectedWallet === wallet.id"
                (click)="selectedWallet = wallet.id"
                (mouseenter)="createParticles($event)"
              >
                <div class="wallet-icon">{{ wallet.icon }}</div>
                <div class="wallet-name">{{ wallet.name }}</div>
              </div>
            </div>

            <button 
              class="confirm-payment-btn" 
              (click)="confirmPayment()"
              (mouseenter)="createParticles($event)"
              [disabled]="paymentProcessing || !selectedWallet"
            >
              <span *ngIf="!paymentProcessing">Pay with {{ getWalletName() }}</span>
              <span *ngIf="paymentProcessing">Processing...</span>
            </button>
          </div>

          <div class="payment-error" *ngIf="paymentError">
            <div class="error-icon">⚠️</div>
            <p>{{ paymentError }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .nearby-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      position: relative;
      overflow: hidden;
      padding: 2rem;
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

    .shape-1 { top: 10%; left: 15%; animation-delay: 0s; }
    .shape-2 { top: 60%; left: 85%; animation-delay: 1.5s; }
    .shape-3 { top: 80%; right: 20%; animation-delay: 2s; }
    .shape-4 { top: 25%; right: 10%; animation-delay: 0.5s; }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-30px) rotate(10deg); }
    }

    .nearby-container {
      position: relative;
      z-index: 3;
      max-width: 1400px;
      margin: 0 auto;
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

    .header-section {
      text-align: center;
      margin-bottom: 3rem;
    }

    .header-content {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 3rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 800px;
      margin: 0 auto;
    }

    .page-title {
      font-size: 3rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 1rem 0;
    }

    .page-subtitle {
      font-size: 1.2rem;
      color: #666;
      margin: 0 0 2rem 0;
    }

    .locate-btn {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      border-radius: 12px;
      padding: 1.25rem 2.5rem;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.3s ease;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
    }

    .locate-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
    }

    .locate-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .btn-icon {
      font-size: 1.5rem;
    }

    .btn-arrow {
      font-size: 1.5rem;
      transition: transform 0.3s ease;
    }

    .locate-btn:hover:not(:disabled) .btn-arrow {
      transform: translateX(5px);
    }

    .location-info {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1rem;
      color: #666;
      font-size: 0.95rem;
    }

    .info-icon {
      font-size: 1.2rem;
    }

    .error-message {
      background: linear-gradient(135deg, #ff9a9e, #fecfef);
      color: #721c24;
      padding: 1.5rem;
      border-radius: 16px;
      margin: 2rem auto;
      max-width: 600px;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 10px 30px rgba(255, 154, 158, 0.3);
    }

    .error-icon {
      font-size: 2rem;
    }

    .results-section {
      animation: fadeInUp 0.6s ease-out;
    }

    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .results-header h2 {
      color: white;
      font-size: 2rem;
      margin: 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    }

    .filter-options {
      display: flex;
      gap: 0.75rem;
    }

    .filter-btn {
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      padding: 0.5rem 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .filter-btn:hover, .filter-btn.active {
      background: rgba(255, 255, 255, 0.9);
      color: #667eea;
      border-color: white;
    }

    .ngos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
    }

    .ngo-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
      position: relative;
      animation: slideInUp 0.6s ease-out both;
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .ngo-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
    }

    .card-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: linear-gradient(135deg, #11998e, #38ef7d);
      color: white;
      padding: 0.4rem 0.8rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.3rem;
      box-shadow: 0 4px 12px rgba(17, 153, 142, 0.3);
    }

    .ngo-header {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .ngo-avatar {
      width: 70px;
      height: 70px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }

    .avatar-icon {
      font-size: 2rem;
    }

    .ngo-info {
      flex: 1;
      min-width: 0;
    }

    .ngo-name {
      font-size: 1.4rem;
      font-weight: 700;
      color: #333;
      margin: 0 0 0.5rem 0;
      word-wrap: break-word;
    }

    .ngo-distance {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      color: #667eea;
      font-weight: 600;
      font-size: 0.95rem;
    }

    .ngo-details {
      margin-bottom: 1.5rem;
    }

    .detail-item {
      display: flex;
      align-items: start;
      gap: 0.75rem;
      padding: 0.75rem;
      background: rgba(102, 126, 234, 0.05);
      border-radius: 10px;
      margin-bottom: 0.5rem;
      color: #555;
      font-size: 0.95rem;
    }

    .detail-icon {
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .focus-areas {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .focus-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
    }

    .ngo-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: rgba(102, 126, 234, 0.05);
      border-radius: 12px;
    }

    .stat {
      text-align: center;
    }

    .stat-value {
      font-size: 1.3rem;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-size: 0.85rem;
      color: #666;
    }

    .ngo-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    .action-btn {
      padding: 0.75rem;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .action-btn.primary {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    }

    .action-btn.primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }

    .action-btn.secondary {
      background: white;
      color: #667eea;
      border: 2px solid #667eea;
    }

    .action-btn.secondary:hover {
      background: #667eea;
      color: white;
    }

    .empty-state, .no-results {
      text-align: center;
      padding: 4rem 2rem;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
      max-width: 600px;
      margin: 0 auto;
    }

    .empty-icon, .no-results-icon {
      font-size: 5rem;
      margin-bottom: 1rem;
    }

    .empty-state h3, .no-results h3 {
      font-size: 2rem;
      color: #333;
      margin: 0 0 1rem 0;
    }

    .empty-state p, .no-results p {
      color: #666;
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }

    .features-list {
      display: grid;
      gap: 0.75rem;
      text-align: left;
      max-width: 400px;
      margin: 0 auto;
    }

    .feature {
      padding: 1rem;
      background: rgba(102, 126, 234, 0.1);
      border-radius: 10px;
      color: #333;
      font-weight: 500;
    }

    .retry-btn {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      border-radius: 12px;
      padding: 1rem 2rem;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .retry-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 2rem;
      }

      .ngos-grid {
        grid-template-columns: 1fr;
      }

      .results-header {
        flex-direction: column;
        align-items: stretch;
      }

      .filter-options {
        overflow-x: auto;
        justify-content: start;
      }

      .ngo-actions {
        grid-template-columns: 1fr;
      }
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.3s ease-out;
      padding: 1rem;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .modal-content {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95));
      backdrop-filter: blur(20px);
      border-radius: 24px;
      max-width: 600px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      animation: slideUp 0.4s ease-out;
      box-shadow: 0 25px 60px rgba(102, 126, 234, 0.3);
      border: 1px solid rgba(102, 126, 234, 0.2);
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(50px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .modal-close {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      background: rgba(255, 255, 255, 0.9);
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #667eea;
      z-index: 1;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .modal-close:hover {
      background: #667eea;
      color: white;
      transform: rotate(90deg);
    }

    .modal-header {
      text-align: center;
      padding: 2.5rem 2rem 1.5rem;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
      border-radius: 24px 24px 0 0;
    }

    .modal-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      animation: bounce 1s ease-in-out infinite;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .modal-header h2 {
      font-size: 2rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.5rem;
    }

    .modal-ngo-name {
      font-size: 1.1rem;
      color: #667eea;
      font-weight: 600;
    }

    .donation-form {
      padding: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      font-weight: 600;
      color: #333;
      margin-bottom: 0.5rem;
      font-size: 0.95rem;
    }

    .form-control {
      width: 100%;
      padding: 1rem;
      border: 2px solid rgba(102, 126, 234, 0.2);
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: rgba(255, 255, 255, 0.9);
      box-sizing: border-box;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }

    select.form-control {
      cursor: pointer;
    }

    textarea.form-control {
      resize: vertical;
      min-height: 80px;
      font-family: inherit;
    }

    .radio-group {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .radio-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: rgba(102, 126, 234, 0.05);
      border: 2px solid rgba(102, 126, 234, 0.2);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      flex: 1;
      min-width: 150px;
    }

    .radio-label:hover {
      background: rgba(102, 126, 234, 0.1);
      border-color: #667eea;
    }

    .radio-label input[type="radio"] {
      cursor: pointer;
    }

    .donation-summary {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
      padding: 1.5rem;
      border-radius: 12px;
      margin-bottom: 1.5rem;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      color: #333;
    }

    .summary-row.total {
      border-top: 2px solid rgba(102, 126, 234, 0.3);
      margin-top: 0.5rem;
      padding-top: 1rem;
      font-weight: 700;
      font-size: 1.2rem;
    }

    .summary-row .amount {
      color: #667eea;
      font-weight: 700;
    }

    .summary-row .donation-type {
      color: #667eea;
      font-weight: 600;
      text-transform: capitalize;
    }

    .summary-note {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 193, 7, 0.1);
      padding: 0.75rem;
      border-radius: 8px;
      margin-top: 1rem;
      font-size: 0.9rem;
      color: #856404;
      border: 1px solid rgba(255, 193, 7, 0.3);
    }

    .note-icon {
      font-size: 1.2rem;
    }

    .error-message, .success-message {
      padding: 1rem;
      border-radius: 12px;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .error-message {
      background: rgba(239, 68, 68, 0.1);
      border: 2px solid rgba(239, 68, 68, 0.3);
      color: #dc2626;
    }

    .success-message {
      background: rgba(34, 197, 94, 0.1);
      border: 2px solid rgba(34, 197, 94, 0.3);
      color: #16a34a;
    }

    .error-icon, .success-icon {
      font-size: 1.5rem;
    }

    .modal-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn-cancel, .btn-donate {
      padding: 1rem;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-cancel {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
      border: 2px solid rgba(102, 126, 234, 0.3);
    }

    .btn-cancel:hover {
      background: rgba(102, 126, 234, 0.2);
      transform: translateY(-2px);
    }

    .btn-donate {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }

    .btn-donate:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
    }

    .btn-donate:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Payment Modal Styles */
    .payment-modal {
      max-width: 700px;
    }

    .payment-amount {
      font-size: 2.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-top: 1rem;
    }

    .payment-methods, .payment-details {
      padding: 2rem;
    }

    .section-title {
      font-size: 1.3rem;
      font-weight: 700;
      color: #333;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .payment-options {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .payment-option {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: rgba(102, 126, 234, 0.05);
      border: 2px solid rgba(102, 126, 234, 0.2);
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .payment-option:hover {
      background: rgba(102, 126, 234, 0.1);
      border-color: #667eea;
      transform: translateX(10px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
    }

    .option-icon {
      font-size: 2.5rem;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
      border-radius: 12px;
    }

    .option-details {
      flex: 1;
    }

    .option-details h4 {
      font-size: 1.2rem;
      font-weight: 700;
      color: #333;
      margin-bottom: 0.25rem;
    }

    .option-details p {
      color: #666;
      font-size: 0.9rem;
    }

    .option-arrow {
      font-size: 1.5rem;
      color: #667eea;
      transition: transform 0.3s ease;
    }

    .payment-option:hover .option-arrow {
      transform: translateX(5px);
    }

    .back-btn {
      background: rgba(102, 126, 234, 0.1);
      border: none;
      border-radius: 8px;
      padding: 0.75rem 1.5rem;
      color: #667eea;
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 1.5rem;
      transition: all 0.3s ease;
    }

    .back-btn:hover {
      background: rgba(102, 126, 234, 0.2);
      transform: translateX(-5px);
    }

    .qr-section {
      text-align: center;
      padding: 2rem;
      background: rgba(102, 126, 234, 0.05);
      border-radius: 16px;
      margin-bottom: 1.5rem;
    }

    .upi-input-section {
      margin-bottom: 2rem;
    }

    .input-label {
      display: block;
      font-weight: 600;
      color: #333;
      margin-bottom: 0.5rem;
      font-size: 0.95rem;
    }

    .upi-input-group {
      display: flex;
      gap: 0.75rem;
    }

    .upi-input {
      flex: 1;
      padding: 0.85rem 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.3s ease;
      font-family: monospace;
    }

    .upi-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }

    .verify-btn {
      padding: 0.85rem 1.5rem;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    .verify-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }

    .verify-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .input-hint {
      color: #666;
      font-size: 0.85rem;
      margin-top: 0.5rem;
      margin-bottom: 0;
    }

    .divider-text {
      text-align: center;
      margin: 1.5rem 0;
      position: relative;
    }

    .divider-text::before,
    .divider-text::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 40%;
      height: 1px;
      background: #e0e0e0;
    }

    .divider-text::before { left: 0; }
    .divider-text::after { right: 0; }

    .divider-text span {
      background: white;
      padding: 0 1rem;
      color: #999;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .qr-code {
      width: 250px;
      height: 250px;
      margin: 0 auto 1rem;
      background: white;
      padding: 1rem;
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }

    .qr-code canvas {
      width: 100% !important;
      height: 100% !important;
    }

    .qr-instruction {
      color: #666;
      margin-bottom: 1rem;
    }

    .upi-id {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      background: white;
      padding: 1rem;
      border-radius: 12px;
      margin-top: 1rem;
    }

    .upi-id .label {
      font-weight: 600;
      color: #333;
    }

    .upi-id .value {
      color: #667eea;
      font-weight: 600;
      font-family: monospace;
    }

    .copy-btn {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .copy-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .payment-info {
      background: rgba(102, 126, 234, 0.05);
      padding: 1.5rem;
      border-radius: 12px;
      margin-bottom: 1.5rem;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      color: #333;
      font-weight: 500;
    }

    .info-row .highlight {
      color: #667eea;
      font-weight: 700;
      font-size: 1.2rem;
    }

    .confirm-payment-btn {
      width: 100%;
      background: linear-gradient(135deg, #16a34a, #15803d);
      color: white;
      border: none;
      border-radius: 12px;
      padding: 1.25rem;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 8px 20px rgba(22, 163, 74, 0.3);
    }

    .confirm-payment-btn:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 12px 30px rgba(22, 163, 74, 0.4);
    }

    .confirm-payment-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .card-form {
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1rem;
    }

    .bank-selection, .wallet-selection {
      margin-bottom: 1.5rem;
    }

    .wallet-selection {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .wallet-option {
      padding: 1.5rem;
      background: rgba(102, 126, 234, 0.05);
      border: 2px solid rgba(102, 126, 234, 0.2);
      border-radius: 12px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .wallet-option:hover {
      background: rgba(102, 126, 234, 0.1);
      border-color: #667eea;
      transform: translateY(-5px);
    }

    .wallet-option.selected {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
      border-color: #667eea;
      border-width: 3px;
    }

    .wallet-icon {
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }

    .wallet-name {
      font-weight: 600;
      color: #333;
    }

    .payment-error {
      padding: 1rem;
      background: rgba(239, 68, 68, 0.1);
      border: 2px solid rgba(239, 68, 68, 0.3);
      border-radius: 12px;
      color: #dc2626;
      text-align: center;
      margin: 1rem 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
    }

    .error-icon {
      font-size: 1.5rem;
    }

    @media (max-width: 768px) {
      .modal-content {
        margin: 1rem;
        max-height: 95vh;
      }

      .modal-header {
        padding: 2rem 1.5rem 1rem;
      }

      .donation-form {
        padding: 1.5rem;
      }

      .modal-actions {
        grid-template-columns: 1fr;
      }

      .radio-group {
        flex-direction: column;
      }

      .radio-label {
        min-width: 100%;
      }

      .payment-methods, .payment-details {
        padding: 1.5rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .wallet-selection {
        grid-template-columns: repeat(2, 1fr);
      }

      .qr-code {
        width: 200px;
        height: 200px;
      }
    }
  `]
})
export class NearbyNgosComponent implements OnInit, AfterViewInit, OnDestroy {
  ngos: any[] = [];
  filteredNgos: any[] = [];
  selectedFilter: string = 'All';
  error = '';
  loading = false;
  currentLocation: { lat: number; lng: number } | null = null;
  Math = Math;
  private isBrowser: boolean;

  // Shipping charge constant
  readonly SHIPPING_CHARGE = 50; // ₹50 for home pickup

  // Modal state
  showDonateModal = false;
  selectedNgo: any = null;
  donationForm = {
    type: 'MONEY',
    amount: 0,
    description: '',
    pickupRequired: false,
    pickupAddress: ''
  };
  donationSubmitting = false;
  donationError: string | null = null;
  donationSuccess = false;

  // Payment modal state
  showPaymentModal = false;
  selectedPaymentMethod: string | null = null;
  paymentAmount = 0;
  paymentProcessing = false;
  paymentError: string | null = null;
  pendingDonationId: string | null = null;

  // UPI details
  generatedUpiId = '';
  userUpiId = '';
  // If provided, use this static QR image instead of generating one
  // Put your QR image at client/src/assets/upi/phonepe-qr.png
  qrImageUrl: string | null = UPI_QR_IMAGE_URL || null;

  // Card details
  cardDetails = {
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  };

  // Bank selection
  selectedBank = '';

  // Wallet selection
  selectedWallet = '';
  walletOptions = [
    { id: 'paytm', name: 'Paytm', icon: '💰' },
    { id: 'phonepe', name: 'PhonePe', icon: '📱' },
    { id: 'googlepay', name: 'Google Pay', icon: '🔵' },
    { id: 'amazonpay', name: 'Amazon Pay', icon: '🛒' }
  ];

  @ViewChild('qrCanvas', { static: false }) qrCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
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

  initParticles() {
    if (typeof particlesJS !== 'undefined') {
      particlesJS('particles-js', {
        particles: {
          number: { value: 60, density: { enable: true, value_area: 800 } },
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
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.ngo-card').forEach(el => {
      observer.observe(el);
    });
  }

  onMouseMove(event: MouseEvent) {
    const shapes = document.querySelectorAll('.shape');
    const x = event.clientX / window.innerWidth;
    const y = event.clientY / window.innerHeight;

    shapes.forEach((shape, index) => {
      const speed = (index + 1) * 20;
      const xMove = (x - 0.5) * speed;
      const yMove = (y - 0.5) * speed;
      (shape as HTMLElement).style.transform = `translate(${xMove}px, ${yMove}px)`;
    });
  }

  createParticles(event: MouseEvent) {
    if (!this.isBrowser) return;

    const colors = ['#667eea', '#764ba2'];
    const particleCount = 5;
    const angleStep = (2 * Math.PI) / particleCount;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      const angle = i * angleStep;
      const velocity = 1.5 + Math.random() * 1.5;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;

      particle.style.position = 'fixed';
      particle.style.left = event.clientX + 'px';
      particle.style.top = event.clientY + 'px';
      particle.style.width = '6px';
      particle.style.height = '6px';
      particle.style.borderRadius = '50%';
      particle.style.backgroundColor = color;
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '9999';
      particle.style.boxShadow = `0 0 8px ${color}`;

      document.body.appendChild(particle);

      let x = event.clientX;
      let y = event.clientY;
      let opacity = 1;

      const animate = () => {
        x += vx;
        y += vy;
        opacity -= 0.03;

        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.opacity = opacity.toString();

        if (opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          particle.remove();
        }
      };

      requestAnimationFrame(animate);
    }
  }

  findNearby() {
    this.error = '';
    this.loading = true;
    this.ngos = [];
    
    if (!navigator.geolocation) {
      this.error = 'Geolocation is not supported by your browser';
      this.loading = false;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        this.currentLocation = { lat: latitude, lng: longitude };
        
  this.http.get<any[]>(`/api/ngos/nearby?lat=${latitude}&lng=${longitude}&radiusKm=5000`)
          .subscribe({
            next: (ngos) => {
              this.ngos = ngos.map(ngo => ({
                ...ngo,
                distance: this.calculateDistance(latitude, longitude, ngo.location?.coordinates[1], ngo.location?.coordinates[0])
              }));
              this.filteredNgos = [...this.ngos]; // Initialize filtered list
              this.selectedFilter = 'All'; // Reset filter
              this.loading = false;
              
              // If no NGOs found, show helpful message
              if (this.ngos.length === 0) {
                this.error = 'No verified NGOs found within 5000 km of your location. Our sample NGOs are located in Delhi, Mumbai, and Bangalore.';
              }
            },
            error: (err) => {
              console.error('API Error:', err);
              this.error = 'Failed to fetch nearby NGOs. Please try again.';
              this.loading = false;
            }
          });
      },
      () => {
        this.error = 'Could not access your location. Please enable location services.';
        this.loading = false;
      }
    );
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  filterByCategory(category: string) {
    this.selectedFilter = category;
    
    if (category === 'All') {
      this.filteredNgos = [...this.ngos];
    } else {
      this.filteredNgos = this.ngos.filter(ngo => 
        ngo.focusAreas && ngo.focusAreas.some((area: string) => 
          area.toLowerCase() === category.toLowerCase()
        )
      );
    }
  }

  openDonateModal(ngo: any) {
    // Check if user is logged in
    const token = localStorage.getItem('dc_token');
    if (!token) {
      alert('Please login to make a donation');
      window.location.href = '/login';
      return;
    }

    this.selectedNgo = ngo;
    this.showDonateModal = true;
    this.donationError = null;
    this.donationSuccess = false;
    
    // Reset form
    this.donationForm = {
      type: 'MONEY',
      amount: 0,
      description: '',
      pickupRequired: false,
      pickupAddress: ''
    };
  }

  closeDonateModal() {
    this.showDonateModal = false;
    this.selectedNgo = null;
    this.donationError = null;
    this.donationSuccess = false;
  }

  // Calculate shipping charge
  getShippingCharge(): number {
    // Add shipping charge whenever pickup is required (for any donation type)
    if (this.donationForm.pickupRequired) {
      return this.SHIPPING_CHARGE;
    }
    return 0;
  }

  // Calculate processing fee (2% of donation amount)
  getProcessingFee(): number {
    if (this.donationForm.type === 'MONEY' && this.donationForm.amount) {
      return this.donationForm.amount * 0.02;
    }
    return 0;
  }

  // Calculate total amount
  getTotalAmount(): number {
    if (this.donationForm.type === 'MONEY' && this.donationForm.amount) {
      return this.donationForm.amount + this.getProcessingFee() + this.getShippingCharge();
    }
    return 0;
  }

  submitDonation(event: Event) {
    event.preventDefault();
    
    if (!this.selectedNgo) return;

    // Validate form
    if (this.donationForm.type === 'MONEY' && (!this.donationForm.amount || this.donationForm.amount <= 0)) {
      this.donationError = 'Please enter a valid amount';
      return;
    }

    if (this.donationForm.type !== 'MONEY' && !this.donationForm.description) {
      this.donationError = 'Please provide a description';
      return;
    }

    if (this.donationForm.pickupRequired && !this.donationForm.pickupAddress) {
      this.donationError = 'Please provide pickup address';
      return;
    }

    // For MONEY donations, go directly to payment modal
    if (this.donationForm.type === 'MONEY') {
      this.donationError = null;
      // Close modal but keep selectedNgo for payment
      this.showDonateModal = false;
      this.donationError = null;
      this.donationSuccess = false;
      setTimeout(() => {
        this.openPaymentModal();
      }, 300);
      return;
    }

    // For non-money donations, create the donation record
    this.donationSubmitting = true;
    this.donationError = null;

    const token = localStorage.getItem('dc_token');
    
    // Get the NGO user ID - it could be in user._id or user property depending on population
    const ngoUserId = this.selectedNgo.user?._id || this.selectedNgo.user;
    
    const donationData = {
      ngoId: ngoUserId, // Send the User ID that owns the NGO profile
      type: this.donationForm.type,
      amount: this.donationForm.type === 'MONEY' ? this.donationForm.amount : undefined,
      description: this.donationForm.type !== 'MONEY' ? this.donationForm.description : `Donation of ₹${this.donationForm.amount}`,
      pickupRequired: this.donationForm.pickupRequired,
      pickupAddress: this.donationForm.pickupRequired ? this.donationForm.pickupAddress : undefined
    };

    this.http.post<any>('/api/donations', donationData, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (response) => {
        console.log('Donation submitted:', response);
        this.donationSuccess = true;
        this.donationSubmitting = false;
        
        setTimeout(() => {
          this.closeDonateModal();
          alert('Thank you for your donation! 💝');
        }, 2000);
      },
      error: (err) => {
        console.error('Donation error:', err);
        this.donationError = err.error?.message || 'Failed to submit donation. Please try again.';
        this.donationSubmitting = false;
      }
    });
  }

  openPaymentModal() {
    this.paymentAmount = this.getTotalAmount(); // Use total amount including shipping
    this.showPaymentModal = true;
    this.selectedPaymentMethod = null;
    this.paymentError = null;
    
    // Reset payment details
    this.cardDetails = { number: '', expiry: '', cvv: '', name: '' };
    this.selectedBank = '';
    this.selectedWallet = '';
  }

  closePaymentModal() {
    this.showPaymentModal = false;
    this.selectedPaymentMethod = null;
    this.paymentError = null;
    // Clear selected NGO when payment modal is closed
    this.selectedNgo = null;
  }

  selectPaymentMethod(method: string) {
    this.selectedPaymentMethod = method;
    this.paymentError = null;
    
    // Generate UPI ID if UPI is selected
    if (method === 'UPI') {
      this.generateUpiId();
      // If a static QR image is configured, don't generate a dynamic QR
      if (!this.qrImageUrl) {
        setTimeout(() => this.generateQRCode(), 100);
      }
    }
  }

  generateUpiId() {
    // Generate a realistic UPI ID based on NGO name
    const ngoName = this.selectedNgo?.organizationName?.replace(/\s+/g, '').toLowerCase() || 'ngo';
    this.generatedUpiId = `${ngoName}.donate@paytm`;
  }

  generateQRCode() {
    if (!this.isBrowser || !this.qrCanvas) return;

    const canvas = this.qrCanvas.nativeElement;
    
    // Create UPI payment URL with all required parameters
    const upiUrl = `upi://pay?pa=${this.generatedUpiId}&pn=${encodeURIComponent(this.selectedNgo?.organizationName || 'NGO')}&am=${this.paymentAmount}&cu=INR&tn=${encodeURIComponent(`Donation to ${this.selectedNgo?.organizationName || 'NGO'}`)}`;
    
    // Generate realistic QR code using qrcode library
    QRCode.toCanvas(canvas, upiUrl, {
      width: 250,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    }, (error) => {
      if (error) {
        console.error('QR Code generation error:', error);
      }
    });
  }

  onQrImageError() {
    // If the static image is missing or fails to load, fallback to generating QR
    this.qrImageUrl = null;
    if (this.selectedPaymentMethod === 'UPI') {
      setTimeout(() => this.generateQRCode(), 0);
    }
  }

  onUpiIdChange() {
    // Clear any previous errors when user types
    this.paymentError = null;
  }

  verifyUpiId() {
    if (!this.userUpiId) {
      this.paymentError = 'Please enter a UPI ID';
      return;
    }

    // Basic UPI ID validation
    const upiRegex = /^[\w.-]+@[\w.-]+$/;
    if (!upiRegex.test(this.userUpiId)) {
      this.paymentError = 'Invalid UPI ID format. Example: yourname@paytm';
      return;
    }

    this.paymentError = null;
    alert(`✓ UPI ID verified: ${this.userUpiId}\n\nYou can now proceed with payment using this UPI ID.`);
  }

  drawQRCorner(ctx: CanvasRenderingContext2D, x: number, y: number) {
    // Not needed anymore with real QR code library
  }

  copyUpiId() {
    if (!this.isBrowser) return;
    
    navigator.clipboard.writeText(this.generatedUpiId).then(() => {
      alert('UPI ID copied to clipboard!');
    });
  }

  getWalletName(): string {
    const wallet = this.walletOptions.find(w => w.id === this.selectedWallet);
    return wallet ? wallet.name : 'Wallet';
  }

  confirmPayment() {
    if (!this.selectedPaymentMethod) {
      this.paymentError = 'Please select a payment method';
      return;
    }

    if (!this.selectedNgo) {
      this.paymentError = 'No NGO selected';
      return;
    }

    this.paymentProcessing = true;
    this.paymentError = null;

    // Get the NGO user ID
    const ngoUserId = this.selectedNgo.user?._id || this.selectedNgo.user;
    
    // Create the donation with payment details
    const donationData = {
      ngoId: ngoUserId,
      type: this.donationForm.type,
      amount: this.getTotalAmount(),
      description: `Donation of ₹${this.donationForm.amount}`,
      pickupRequired: this.donationForm.pickupRequired,
      pickupAddress: this.donationForm.pickupRequired ? this.donationForm.pickupAddress : undefined,
      status: 'COMPLETED',
      paymentMethod: this.selectedPaymentMethod,
      transactionId: 'TXN' + Date.now(),
      paymentDetails: this.getPaymentDetails()
    };

    // Get authentication token
    const token = localStorage.getItem('dc_token');
    const requestOptions: any = {};
    if (token) {
      requestOptions.headers = { Authorization: `Bearer ${token}` };
    }
    
    // Make the API call to create the donation
    this.http.post<any>('/api/donations', donationData, requestOptions).subscribe({
      next: (response) => {
        console.log('Donation created successfully:', response);
        this.paymentProcessing = false;
        
        // Close modal and reset form
        this.closePaymentModal();
        this.donationForm = {
          type: 'MONEY',
          amount: 0,
          description: '',
          pickupRequired: false,
          pickupAddress: ''
        };
        
        // Show success message
        alert('🎉 Payment Successful!\n\nThank you for your generous donation!\n\nRedirecting to your dashboard...');
        
        // Use window.location for full page reload to ensure fresh data
        setTimeout(() => {
          if (this.isBrowser) {
            window.location.href = '/donor-dashboard';
          }
        }, 1500);
      },
      error: (err) => {
        console.error('Donation error:', err);
        this.paymentProcessing = false;
        this.paymentError = 'Payment failed. Please try again.';
        
        // Don't redirect on error, let user retry
      }
    });
  }

  getPaymentDetails() {
    switch (this.selectedPaymentMethod) {
      case 'UPI':
        return { upiId: this.generatedUpiId };
      case 'CARD':
        return { 
          cardNumber: this.cardDetails.number.slice(-4),
          cardName: this.cardDetails.name 
        };
      case 'NETBANKING':
        return { bank: this.selectedBank };
      case 'WALLET':
        return { wallet: this.selectedWallet };
      default:
        return {};
    }
  }

  viewNgoDetails(ngo: any) {
    alert(`NGO Details:\n\nName: ${ngo.organizationName}\nEmail: ${ngo.email}\nPhone: ${ngo.contactPhone}\nAddress: ${ngo.address}\n\nThis feature will be enhanced with a detailed modal soon!`);
  }
}
