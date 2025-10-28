import { Component, OnInit, AfterViewInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CommonModule } from '@angular/common';

declare const particlesJS: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-page" (mousemove)="onMouseMove($event)">
      <div id="particles-js"></div>
      
      <div class="floating-shapes">
        <div class="shape shape-1">💙</div>
        <div class="shape shape-2">🤝</div>
        <div class="shape shape-3">✨</div>
        <div class="shape shape-4">🌟</div>
      </div>

      <div class="login-container">
        <div class="login-card" (mouseenter)="createParticles($event)">
          <div class="card-glow"></div>
          
          <div class="logo-section">
            <div class="logo-circle">
              <span class="logo-icon">🎯</span>
            </div>
            <h1 class="welcome-title">Welcome Back</h1>
            <p class="welcome-subtitle">Login to continue your journey of giving</p>
          </div>

          <form (ngSubmit)="onSubmit()" class="login-form">
            <div class="input-group" (mouseenter)="createParticles($event)">
              <div class="input-icon">📧</div>
              <input 
                [(ngModel)]="email" 
                name="email" 
                type="email" 
                placeholder="Email Address" 
                required 
                class="form-input"
                [disabled]="otpSent"
              />
            </div>

            <div class="input-group" *ngIf="!useOTP" (mouseenter)="createParticles($event)">
              <div class="input-icon">🔒</div>
              <input 
                [(ngModel)]="password" 
                name="password" 
                type="password" 
                placeholder="Password" 
                [required]="!useOTP" 
                class="form-input"
              />
            </div>

            <div class="input-group" *ngIf="useOTP && otpSent" (mouseenter)="createParticles($event)">
              <div class="input-icon">🔑</div>
              <input 
                [(ngModel)]="otp" 
                name="otp" 
                type="text" 
                placeholder="Enter 6-digit OTP" 
                maxlength="6"
                [required]="useOTP && otpSent" 
                class="form-input"
              />
              <div class="otp-timer" *ngIf="otpTimer > 0">
                ⏱️ {{ getTimerDisplay() }}
              </div>
            </div>

            <div class="otp-info" *ngIf="useOTP && otpSent">
              <p class="otp-message">✉️ OTP sent to {{ email }}</p>
              <button type="button" class="resend-btn" (click)="resendOTP()" [disabled]="otpTimer > 540">
                {{ otpTimer > 540 ? 'Wait ' + (600 - otpTimer) + 's' : 'Resend OTP' }}
              </button>
            </div>

            <div class="form-footer" *ngIf="!useOTP">
              <label class="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" class="forgot-link">Forgot Password?</a>
            </div>

            <button 
              type="submit" 
              class="login-btn"
              (mouseenter)="createParticles($event)"
            >
              <span class="btn-text">{{ otpSent ? 'Verify OTP' : useOTP ? 'Send OTP' : 'Login' }}</span>
              <span class="btn-icon">→</span>
            </button>

            <button 
              type="button" 
              class="toggle-otp-btn"
              (click)="toggleOTPMode()"
            >
              {{ useOTP ? '🔒 Login with Password' : '📧 Login with OTP' }}
            </button>
          </form>

          <div class="success-message" *ngIf="success">
            <div class="success-icon">✓</div>
            <p>Login successful! Redirecting...</p>
          </div>

          <div class="error-message" *ngIf="error">
            <div class="error-icon">⚠️</div>
            <p>{{ error }}</p>
          </div>

          <div class="divider">
            <span>OR</span>
          </div>

          <div class="social-login">
            <button class="social-btn google" type="button">
              <span class="social-icon">G</span>
              <span>Continue with Google</span>
            </button>
          </div>

          <div class="signup-prompt">
            <p>Don't have an account? <a routerLink="/signup" class="signup-link">Create Account</a></p>
          </div>
        </div>

        <div class="info-panel">
          <div class="info-content">
            <h2 class="info-title">Join Our Community</h2>
            <div class="info-stats">
              <div class="stat-item">
                <div class="stat-number">500+</div>
                <div class="stat-label">Verified NGOs</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">10K+</div>
                <div class="stat-label">Active Donors</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">₹50L+</div>
                <div class="stat-label">Donated</div>
              </div>
            </div>
            <div class="info-features">
              <div class="feature-item">✓ Secure & Transparent</div>
              <div class="feature-item">✓ Verified NGOs</div>
              <div class="feature-item">✓ Real-time Tracking</div>
              <div class="feature-item">✓ Tax Benefits</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
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

    .shape-1 { top: 10%; left: 10%; animation-delay: 0s; }
    .shape-2 { top: 70%; left: 80%; animation-delay: 1s; }
    .shape-3 { top: 30%; right: 15%; animation-delay: 2s; }
    .shape-4 { bottom: 20%; left: 70%; animation-delay: 1.5s; }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-30px) rotate(10deg); }
    }

    .login-container {
      position: relative;
      z-index: 3;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      max-width: 1200px;
      width: 100%;
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

    .login-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 3rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      position: relative;
      overflow: hidden;
      transition: transform 0.3s ease;
    }

    .login-card:hover {
      transform: translateY(-5px);
    }

    .card-glow {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
      animation: rotate 10s linear infinite;
      pointer-events: none;
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .logo-section {
      text-align: center;
      margin-bottom: 2rem;
      position: relative;
      z-index: 2;
    }

    .logo-circle {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .logo-icon {
      font-size: 2.5rem;
    }

    .welcome-title {
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 0.5rem 0;
    }

    .welcome-subtitle {
      color: #666;
      font-size: 1rem;
      margin: 0;
    }

    .login-form {
      position: relative;
      z-index: 2;
    }

    .input-group {
      position: relative;
      margin-bottom: 1.5rem;
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.2rem;
      z-index: 2;
    }

    .form-input {
      width: 100%;
      padding: 1rem 1rem 1rem 3.5rem;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: white;
      box-sizing: border-box;
    }

    .form-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }

    .form-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
    }

    .remember-me {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      color: #666;
    }

    .remember-me input[type="checkbox"] {
      width: auto;
      cursor: pointer;
    }

    .forgot-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .forgot-link:hover {
      color: #764ba2;
    }

    .login-btn {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
    }

    .login-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
    }

    .login-btn:active {
      transform: translateY(0);
    }

    .btn-icon {
      font-size: 1.5rem;
      transition: transform 0.3s ease;
    }

    .login-btn:hover .btn-icon {
      transform: translateX(5px);
    }

    .toggle-otp-btn {
      width: 100%;
      padding: 0.75rem;
      margin-top: 1rem;
      background: transparent;
      color: #667eea;
      border: 2px solid #667eea;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .toggle-otp-btn:hover {
      background: #667eea;
      color: white;
      transform: translateY(-2px);
    }

    .otp-info {
      margin: 1rem 0;
      text-align: center;
    }

    .otp-message {
      color: #667eea;
      font-size: 0.9rem;
      margin: 0 0 0.5rem 0;
      font-weight: 500;
    }

    .resend-btn {
      padding: 0.5rem 1.5rem;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .resend-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    }

    .resend-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .otp-timer {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #667eea;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .form-input:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
      opacity: 0.7;
    }

    .success-message, .error-message {
      padding: 1rem;
      border-radius: 12px;
      margin-top: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .success-message {
      background: linear-gradient(135deg, #d4fc79, #96e6a1);
      color: #155724;
    }

    .error-message {
      background: linear-gradient(135deg, #ff9a9e, #fecfef);
      color: #721c24;
    }

    .success-icon, .error-icon {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .divider {
      position: relative;
      text-align: center;
      margin: 2rem 0;
      color: #999;
    }

    .divider::before,
    .divider::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 40%;
      height: 1px;
      background: #e0e0e0;
    }

    .divider::before { left: 0; }
    .divider::after { right: 0; }

    .divider span {
      background: rgba(255, 255, 255, 0.95);
      padding: 0 1rem;
      position: relative;
      z-index: 1;
    }

    .social-login {
      margin-bottom: 1.5rem;
    }

    .social-btn {
      width: 100%;
      padding: 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      background: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      font-size: 1rem;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .social-btn:hover {
      border-color: #667eea;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .social-icon {
      font-weight: bold;
      color: #EA4335;
    }

    .signup-prompt {
      text-align: center;
      color: #666;
      position: relative;
      z-index: 2;
    }

    .signup-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .signup-link:hover {
      color: #764ba2;
    }

    .info-panel {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 3rem;
      border: 2px solid rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .info-content {
      color: white;
      text-align: center;
    }

    .info-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 2rem 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    }

    .info-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    }

    .stat-label {
      font-size: 1rem;
      opacity: 0.9;
    }

    .info-features {
      display: grid;
      gap: 1rem;
    }

    .feature-item {
      font-size: 1.1rem;
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      backdrop-filter: blur(10px);
    }

    @media (max-width: 968px) {
      .login-container {
        grid-template-columns: 1fr;
      }

      .info-panel {
        display: none;
      }
    }

    @media (max-width: 640px) {
      .login-page {
        padding: 1rem;
      }

      .login-card {
        padding: 2rem 1.5rem;
      }

      .welcome-title {
        font-size: 2rem;
      }

      .info-stats {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }
  `]
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  email = '';
  password = '';
  otp = '';
  error = '';
  success = false;
  useOTP = false;
  otpSent = false;
  otpTimer = 0;
  private isBrowser: boolean;
  private timerInterval: any;

  constructor(
    private auth: AuthService, 
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
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
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
          number: { value: 80, density: { enable: true, value_area: 800 } },
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

    document.querySelectorAll('.login-card, .info-panel').forEach(el => {
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

  onSubmit() {
    this.error = '';
    this.success = false;
    
    if (this.useOTP && this.otpSent) {
      // Verify OTP
      this.auth.loginWithOTP(this.email, this.otp).subscribe({
        next: (res) => {
          this.success = true;
          if (this.timerInterval) {
            clearInterval(this.timerInterval);
          }
          setTimeout(() => {
            const role = res.user.role.toLowerCase();
            this.router.navigate([`/${role}`]);
          }, 1500);
        },
        error: (err) => {
          this.error = err.error?.message || 'Invalid OTP. Please try again.';
        }
      });
    } else if (this.useOTP && !this.otpSent) {
      // Request OTP
      this.requestOTP();
    } else {
      // Regular password login
      this.auth.login(this.email, this.password).subscribe({
        next: (res) => {
          this.success = true;
          setTimeout(() => {
            const role = res.user.role.toLowerCase();
            this.router.navigate([`/${role}`]);
          }, 1500);
        },
        error: () => {
          this.error = 'Invalid credentials. Please try again.';
        }
      });
    }
  }

  requestOTP() {
    if (!this.email) {
      this.error = 'Please enter your email address';
      return;
    }

    this.auth.requestLoginOTP(this.email).subscribe({
      next: () => {
        this.otpSent = true;
        this.error = '';
        this.startTimer();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to send OTP. Please try again.';
      }
    });
  }

  startTimer() {
    this.otpTimer = 600; // 10 minutes in seconds
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.timerInterval = setInterval(() => {
      this.otpTimer--;
      if (this.otpTimer <= 0) {
        clearInterval(this.timerInterval);
        this.otpSent = false;
      }
    }, 1000);
  }

  resendOTP() {
    this.otp = '';
    this.requestOTP();
  }

  toggleOTPMode() {
    this.useOTP = !this.useOTP;
    this.otpSent = false;
    this.otp = '';
    this.error = '';
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  getTimerDisplay(): string {
    const minutes = Math.floor(this.otpTimer / 60);
    const seconds = this.otpTimer % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}
