import { Component, OnInit, AfterViewInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

declare const particlesJS: any;

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="signup-page">
      <div id="particles-js"></div>
      
      <div class="signup-container">
        <!-- Role Selection -->
        <div class="role-selection" *ngIf="!roleSelected">
          <div class="role-header">
            <h1 class="main-title">Join DonateConnect</h1>
            <p class="subtitle">Choose how you want to make a difference</p>
          </div>

          <div class="role-cards">
            <div class="role-card donor-card" (click)="selectRole('DONOR')">
              <div class="role-icon">💝</div>
              <h2>I'm a Donor</h2>
              <p>Support verified NGOs and track your impact</p>
              <ul class="role-features">
                <li>✓ Browse verified NGOs</li>
                <li>✓ Make secure donations</li>
                <li>✓ Track your impact</li>
                <li>✓ Get tax benefits</li>
              </ul>
              <button class="select-role-btn">Join as Donor</button>
            </div>

            <div class="role-card ngo-card" (click)="selectRole('NGO')">
              <div class="role-icon">🏛️</div>
              <h2>I'm an NGO</h2>
              <p>Get verified and receive donations</p>
              <ul class="role-features">
                <li>✓ Get verified badge</li>
                <li>✓ Receive donations</li>
                <li>✓ Manage campaigns</li>
                <li>✓ Expand your reach</li>
              </ul>
              <button class="select-role-btn">Register as NGO</button>
            </div>
          </div>

          <div class="login-prompt">
            Already have an account? <a routerLink="/login" class="link">Login here</a>
          </div>
        </div>

        <!-- Donor Signup Form -->
        <div class="signup-form-container" *ngIf="roleSelected && role === 'DONOR'">
          <button class="back-btn" (click)="resetRole()">← Back</button>
          
          <div class="form-card">
            <div class="form-header">
              <div class="header-icon">💝</div>
              <h2>Create Donor Account</h2>
              <p>Start making a difference today</p>
            </div>

            <form (ngSubmit)="onDonorSubmit()" class="form">
              <div class="input-group">
                <label>Full Name</label>
                <input 
                  [(ngModel)]="name" 
                  name="name" 
                  type="text" 
                  placeholder="Enter your full name" 
                  required 
                />
              </div>

              <div class="input-group">
                <label>Email Address</label>
                <input 
                  [(ngModel)]="email" 
                  name="email" 
                  type="email" 
                  placeholder="your.email@example.com" 
                  required 
                />
              </div>

              <div class="input-group">
                <label>Password</label>
                <input 
                  [(ngModel)]="password" 
                  name="password" 
                  type="password" 
                  placeholder="Minimum 6 characters" 
                  required 
                />
              </div>

              <div class="terms-check">
                <input type="checkbox" id="donor-terms" required />
                <label for="donor-terms">
                  I agree to the <a href="#" class="link">Terms & Conditions</a>
                </label>
              </div>

              <div class="error-message" *ngIf="error">{{ error }}</div>
              <div class="success-message" *ngIf="success">✓ Account created! Redirecting...</div>

              <button type="submit" class="submit-btn">Create Account</button>
            </form>

            <div class="login-link">
              Already have an account? <a routerLink="/login" class="link">Login</a>
            </div>
          </div>
        </div>

        <!-- NGO Signup Form (Multi-step) -->
        <div class="signup-form-container ngo-form" *ngIf="roleSelected && role === 'NGO'">
          <button class="back-btn" (click)="currentStep === 1 ? resetRole() : prevStep()">
            ← {{ currentStep === 1 ? 'Back' : 'Previous' }}
          </button>
          
          <div class="form-card">
            <div class="form-header">
              <div class="header-icon">🏛️</div>
              <h2>NGO Registration</h2>
              <p>Complete verification to receive donations</p>
            </div>

            <!-- Step Progress (Simplified: 2 steps) -->
            <div class="step-progress">
              <div class="step" [class.active]="currentStep >= 1" [class.completed]="currentStep > 1">
                <div class="step-number">1</div>
                <div class="step-label">Account</div>
              </div>
              <div class="step-line" [class.active]="currentStep >= 2"></div>
              <div class="step" [class.active]="currentStep >= 2" [class.completed]="currentStep > 2">
                <div class="step-number">2</div>
                <div class="step-label">Organization</div>
              </div>
              <!-- Steps 3 & 4 hidden in simplified flow -->
            </div>

            <form (ngSubmit)="handleNgoStep()" class="form">
              <!-- Step 1: Account Details -->
              <div class="step-content" *ngIf="currentStep === 1">
                <h3 class="step-title">Account Details</h3>
                
                <div class="input-group">
                  <label>Contact Person Name *</label>
                  <input [(ngModel)]="name" name="name" type="text" placeholder="Full name of contact person" required />
                </div>

                <div class="input-group">
                  <label>Email Address *</label>
                  <input [(ngModel)]="email" name="email" type="email" placeholder="official@ngo.org" required />
                </div>

                <div class="input-group">
                  <label>Password *</label>
                  <input [(ngModel)]="password" name="password" type="password" placeholder="Minimum 6 characters" required />
                </div>

                <div class="input-group">
                  <label>Contact Phone *</label>
                  <input [(ngModel)]="ngoData.contactPhone" name="phone" type="tel" placeholder="+91 XXXXX XXXXX" required />
                </div>
              </div>

              <!-- Step 2: Organization Details -->
              <div class="step-content" *ngIf="currentStep === 2">
                <h3 class="step-title">Organization Details</h3>
                
                <div class="input-group">
                  <label>Organization Name *</label>
                  <input [(ngModel)]="ngoData.organizationName" name="orgName" type="text" placeholder="Registered organization name" required />
                </div>

                <div class="input-group">
                  <label>Registration Number *</label>
                  <input [(ngModel)]="ngoData.registrationNumber" name="regNumber" type="text" placeholder="Government registration number" required />
                </div>

                <div class="input-row">
                  <div class="input-group">
                    <label>Year Established *</label>
                    <input [(ngModel)]="ngoData.yearEstablished" name="year" type="number" placeholder="YYYY" min="1900" [max]="currentYear" required />
                  </div>

                  <div class="input-group">
                    <label>Website (Optional)</label>
                    <input [(ngModel)]="ngoData.website" name="website" type="url" placeholder="https://your-ngo.org" />
                  </div>
                </div>

                <div class="input-group">
                  <label>Organization Description *</label>
                  <textarea [(ngModel)]="ngoData.description" name="description" rows="4" placeholder="Describe your organization's mission and activities..." required></textarea>
                </div>
              </div>

              <!-- Simplified: No Step 3 & 4 (Verification/Docs). Submission happens at end of Step 2. -->

              <div class="error-message" *ngIf="error">{{ error }}</div>
              <div class="success-message" *ngIf="success">✓ Registration submitted! Awaiting verification...</div>

              <div class="form-actions">
                <button 
                  type="button" 
                  class="secondary-btn" 
                  *ngIf="currentStep > 1"
                  (click)="prevStep()"
                >
                  Previous
                </button>
                <button type="submit" class="submit-btn">
                  {{ currentStep < 2 ? 'Continue' : 'Submit Registration' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .signup-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      position: relative;
      overflow-x: hidden;
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

    .signup-container {
      position: relative;
      z-index: 2;
      max-width: 1200px;
      margin: 0 auto;
    }

    /* Role Selection */
    .role-selection {
      animation: fadeIn 0.6s ease-out;
    }

    .role-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .main-title {
      font-size: 3.5rem;
      font-weight: 800;
      color: white;
      margin-bottom: 1rem;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }

    .subtitle {
      font-size: 1.3rem;
      color: rgba(255, 255, 255, 0.9);
    }

    .role-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .role-card {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 3rem;
      border: 2px solid rgba(255, 255, 255, 0.2);
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
    }

    .role-card:hover {
      transform: translateY(-10px);
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.4);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .role-icon {
      font-size: 5rem;
      margin-bottom: 1.5rem;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
    }

    .role-card h2 {
      font-size: 2rem;
      color: white;
      margin-bottom: 1rem;
      font-weight: 700;
    }

    .role-card p {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 2rem;
    }

    .role-features {
      list-style: none;
      padding: 0;
      margin: 2rem 0;
      text-align: left;
    }

    .role-features li {
      color: white;
      padding: 0.7rem 0;
      font-size: 1.05rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }

    .select-role-btn {
      width: 100%;
      padding: 1rem;
      background: white;
      color: #667eea;
      border: none;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .select-role-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .donor-card .select-role-btn {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }

    .ngo-card .select-role-btn {
      background: linear-gradient(135deg, #f093fb, #f5576c);
      color: white;
    }

    /* Signup Form */
    .signup-form-container {
      animation: slideIn 0.5s ease-out;
      max-width: 900px;
      margin: 0 auto;
    }

    .back-btn {
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-size: 1rem;
      cursor: pointer;
      margin-bottom: 1.5rem;
      transition: all 0.3s ease;
    }

    .back-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateX(-5px);
    }

    .form-card {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 3rem;
      border: 2px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .form-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .header-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
    }

    .form-header h2 {
      font-size: 2.5rem;
      color: white;
      margin-bottom: 0.5rem;
      font-weight: 700;
    }

    .form-header p {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.9);
    }

    /* Step Progress */
    .step-progress {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 3rem;
      padding: 0 2rem;
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .step-number {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      border: 2px solid rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.6);
      transition: all 0.3s ease;
    }

    .step.active .step-number {
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-color: white;
      color: white;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.5);
    }

    .step.completed .step-number {
      background: #10b981;
      border-color: white;
      color: white;
    }

    .step-label {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 600;
    }

    .step.active .step-label {
      color: white;
    }

    .step-line {
      flex: 1;
      height: 3px;
      background: rgba(255, 255, 255, 0.2);
      margin: 0 1rem;
      transition: all 0.3s ease;
    }

    .step-line.active {
      background: linear-gradient(90deg, #667eea, #764ba2);
    }

    /* Form Elements */
    .form {
      margin-top: 2rem;
    }

    .step-content {
      animation: fadeIn 0.4s ease-out;
    }

    .step-title {
      font-size: 1.8rem;
      color: white;
      margin-bottom: 0.5rem;
      font-weight: 700;
    }

    .step-description {
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 2rem;
      font-size: 1.05rem;
    }

    .input-group {
      margin-bottom: 1.5rem;
    }

    .input-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .input-group label {
      display: block;
      color: white;
      font-weight: 600;
      margin-bottom: 0.5rem;
      font-size: 1rem;
    }

    .input-group input,
    .input-group textarea {
      width: 100%;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 12px;
      color: white;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .input-group input::placeholder,
    .input-group textarea::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }

    .input-group input:focus,
    .input-group textarea:focus {
      outline: none;
      border-color: white;
      background: rgba(255, 255, 255, 0.25);
      box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1);
    }

    /* Checkbox Grid */
    .checkbox-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 0.75rem;
      margin-top: 1rem;
    }

    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .checkbox-item:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .checkbox-item input[type="checkbox"] {
      width: auto;
      cursor: pointer;
    }

    .checkbox-item span {
      color: white;
      font-size: 0.95rem;
    }

    /* Document Upload */
    .document-upload-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .document-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      border: 2px solid rgba(255, 255, 255, 0.2);
    }

    .doc-info {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex: 1;
    }

    .doc-icon {
      font-size: 2.5rem;
    }

    .doc-details h4 {
      color: white;
      margin-bottom: 0.25rem;
      font-size: 1.1rem;
    }

    .doc-status {
      font-size: 0.9rem;
    }

    .doc-status.pending {
      color: rgba(255, 255, 255, 0.6);
    }

    .doc-status.uploaded {
      color: #10b981;
      font-weight: 600;
    }

    .upload-btn {
      padding: 0.75rem 1.5rem;
      background: rgba(255, 255, 255, 0.2);
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .upload-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.05);
    }

    .upload-btn.uploaded {
      background: rgba(16, 185, 129, 0.3);
      border-color: #10b981;
    }

    /* Terms Checkbox */
    .terms-check {
      display: flex;
      align-items: start;
      gap: 0.75rem;
      margin: 2rem 0;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
    }

    .terms-check input[type="checkbox"] {
      margin-top: 0.25rem;
      cursor: pointer;
    }

    .terms-check label {
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.95rem;
      margin: 0;
    }

    /* Messages */
    .error-message {
      background: rgba(239, 68, 68, 0.2);
      border: 2px solid #ef4444;
      color: white;
      padding: 1rem;
      border-radius: 12px;
      margin: 1rem 0;
      font-weight: 600;
    }

    .success-message {
      background: rgba(16, 185, 129, 0.2);
      border: 2px solid #10b981;
      color: white;
      padding: 1rem;
      border-radius: 12px;
      margin: 1rem 0;
      font-weight: 600;
    }

    /* Buttons */
    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .submit-btn,
    .secondary-btn {
      flex: 1;
      padding: 1.2rem;
      border: none;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .submit-btn {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .submit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
    }

    .secondary-btn {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .secondary-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    /* Links */
    .link {
      color: white;
      text-decoration: underline;
      font-weight: 600;
      transition: opacity 0.2s ease;
    }

    .link:hover {
      opacity: 0.8;
    }

    .login-prompt,
    .login-link {
      text-align: center;
      margin-top: 2rem;
      color: white;
      font-size: 1.05rem;
    }

    /* Animations */
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
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

    /* Responsive */
    @media (max-width: 768px) {
      .signup-page {
        padding: 1rem;
      }

      .main-title {
        font-size: 2.5rem;
      }

      .role-cards {
        grid-template-columns: 1fr;
      }

      .form-card {
        padding: 2rem 1.5rem;
      }

      .step-progress {
        padding: 0;
      }

      .step-label {
        display: none;
      }

      .step-number {
        width: 40px;
        height: 40px;
        font-size: 1.1rem;
      }

      .input-row {
        grid-template-columns: 1fr;
      }

      .checkbox-grid {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class SignupComponent implements OnInit, AfterViewInit, OnDestroy {
  name = '';
  email = '';
  password = '';
  role: 'DONOR' | 'NGO' = 'DONOR';
  roleSelected = false;
  error = '';
  success = false;
  currentStep = 1;
  currentYear = new Date().getFullYear();

  ngoData = {
    organizationName: '',
    registrationNumber: '',
    yearEstablished: '',
    website: '',
    contactPhone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    focusAreas: [] as string[],
    description: '',
    acceptTerms: false
  };

  focusAreaOptions = [
    'Education', 'Healthcare', 'Environment', 'Animal Welfare',
    'Women Empowerment', 'Child Welfare', 'Elderly Care', 'Disaster Relief',
    'Poverty Alleviation', 'Skill Development', 'Rural Development', 'Other'
  ];

  documentTypes = [
    { name: 'Registration Certificate', uploaded: false, file: null as File | null },
    { name: '12A Certificate', uploaded: false, file: null as File | null },
    { name: '80G Certificate', uploaded: false, file: null as File | null },
    { name: 'PAN Card', uploaded: false, file: null as File | null }
  ];
  // Simplified NGO registration flow (2 steps, no documents)
  simpleMode = true;

  private isBrowser: boolean;

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.initParticles();
    }
  }

  ngAfterViewInit() {}

  ngOnDestroy() {}

  initParticles() {
    if (typeof particlesJS !== 'undefined') {
      particlesJS('particles-js', {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: '#ffffff' },
          shape: { type: 'circle' },
          opacity: { value: 0.5, random: true },
          size: { value: 3, random: true },
          line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
          move: { enable: true, speed: 2, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
        },
        interactivity: {
          detect_on: 'canvas',
          events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true }
        },
        retina_detect: true
      });
    }
  }

  selectRole(role: 'DONOR' | 'NGO') {
    this.role = role;
    this.roleSelected = true;
    this.error = '';
    this.success = false;
  }

  resetRole() {
    this.roleSelected = false;
    this.currentStep = 1;
    this.error = '';
    this.success = false;
    this.resetForm();
  }

  resetForm() {
    this.name = '';
    this.email = '';
    this.password = '';
    this.ngoData = {
      organizationName: '',
      registrationNumber: '',
      yearEstablished: '',
      website: '',
      contactPhone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      focusAreas: [],
      description: '',
      acceptTerms: false
    };
    this.documentTypes.forEach(doc => {
      doc.uploaded = false;
      doc.file = null;
    });
  }

  nextStep() {
    if (this.currentStep < 4) {
      this.currentStep++;
      this.error = '';
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.error = '';
    }
  }

  handleNgoStep() {
    this.error = '';

    // Validate current step
    if (this.currentStep === 1) {
      if (!this.name || !this.email || !this.password || !this.ngoData.contactPhone) {
        this.error = 'Please fill all required fields';
        return;
      }
      if (this.password.length < 6) {
        this.error = 'Password must be at least 6 characters';
        return;
      }
      this.nextStep();
    } else if (this.currentStep === 2) {
      // Simplified: Only require Organization Name and basic description (optional)
      if (!this.ngoData.organizationName) {
        this.error = 'Please provide your organization name';
        return;
      }
      // Submit immediately in simplified flow
      this.onNgoSubmitSimple();
    }
  }

  onDonorSubmit() {
    this.error = '';
    this.success = false;
    
    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters long.';
      return;
    }

    this.auth.signup(this.name, this.email, this.password, 'DONOR').subscribe({
      next: (res) => {
        this.success = true;
        setTimeout(() => {
          this.router.navigate(['/donor']);
        }, 1500);
      },
      error: (err) => {
        this.error = err.error?.message || 'Signup failed. Please try again.';
      }
    });
  }

  async onNgoSubmit() {
    this.error = '';
    this.success = false;

    try {
      // First, create the user account
      const signupResponse: any = await new Promise((resolve, reject) => {
        this.auth.signup(this.name, this.email, this.password, 'NGO').subscribe({
          next: resolve,
          error: reject
        });
      });

      // Then, upload documents and create NGO profile
      const formData = new FormData();
      formData.append('organizationName', this.ngoData.organizationName);
      formData.append('registrationNumber', this.ngoData.registrationNumber);
      formData.append('yearEstablished', this.ngoData.yearEstablished);
      formData.append('website', this.ngoData.website);
      formData.append('contactPhone', this.ngoData.contactPhone);
      formData.append('address', this.ngoData.address);
      formData.append('city', this.ngoData.city);
      formData.append('state', this.ngoData.state);
      formData.append('pincode', this.ngoData.pincode);
      formData.append('focusAreas', JSON.stringify(this.ngoData.focusAreas));
      formData.append('description', this.ngoData.description);

      // Append documents
      this.documentTypes.forEach((doc, index) => {
        if (doc.file) {
          formData.append('documents', doc.file, `${doc.name}_${doc.file.name}`);
        }
      });

      // Submit NGO profile with token
      const token = localStorage.getItem('dc_token');
      await new Promise((resolve, reject) => {
  this.http.post('/api/ngos/profile', formData, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).subscribe({
          next: resolve,
          error: reject
        });
      });

      this.success = true;
      setTimeout(() => {
        this.router.navigate(['/ngo']);
      }, 2000);

    } catch (err: any) {
      this.error = err.error?.message || 'Registration failed. Please try again.';
    }
  }

  async onNgoSubmitSimple() {
    this.error = '';
    this.success = false;

    try {
      // 1) Create the NGO user account
      await new Promise((resolve, reject) => {
        this.auth.signup(this.name, this.email, this.password, 'NGO').subscribe({ next: resolve, error: reject });
      });

      // 2) Create minimal NGO profile (no documents, minimal fields)
      const formData = new FormData();
      formData.append('organizationName', this.ngoData.organizationName);
      if (this.ngoData.contactPhone) formData.append('contactPhone', this.ngoData.contactPhone);
      if (this.ngoData.description) formData.append('description', this.ngoData.description);

      const token = localStorage.getItem('dc_token');
      await new Promise((resolve, reject) => {
  this.http.post('/api/ngos/profile', formData, {
          headers: { Authorization: `Bearer ${token}` }
        }).subscribe({ next: resolve, error: reject });
      });

      this.success = true;
      setTimeout(() => this.router.navigate(['/ngo']), 1500);
    } catch (err: any) {
      this.error = err.error?.message || 'Registration failed. Please try again.';
    }
  }

  isFocusAreaSelected(area: string): boolean {
    return this.ngoData.focusAreas.includes(area);
  }

  toggleFocusArea(area: string) {
    const index = this.ngoData.focusAreas.indexOf(area);
    if (index > -1) {
      this.ngoData.focusAreas.splice(index, 1);
    } else {
      this.ngoData.focusAreas.push(area);
    }
  }

  onFileSelect(event: any, docIndex: number) {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.error = 'File size must be less than 5MB';
        return;
      }

      this.documentTypes[docIndex].file = file;
      this.documentTypes[docIndex].uploaded = true;
      this.error = '';
    }
  }
}
