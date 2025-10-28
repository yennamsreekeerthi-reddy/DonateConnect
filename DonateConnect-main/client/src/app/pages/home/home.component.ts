import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/auth.service';

declare var particlesJS: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="home-wrapper">
      <!-- Particles Background -->
      <div id="particles-js" class="particles-container"></div>

      <!-- Hero Section with Parallax -->
      <section class="hero-section parallax" #heroSection>
        <div class="hero-overlay"></div>
        <div class="hero-content" #heroContent>
          <div class="hero-badge pulse-animation">
            <span class="badge-icon">🌟</span>
            <span>India's #1 Donation Platform</span>
          </div>
          <h1 class="hero-title gradient-text" #heroTitle>
            Connect Hearts,
            <br/>
            <span class="highlight">Transform Lives</span>
          </h1>
          <p class="hero-subtitle" #heroSubtitle>
            Empowering NGOs and donors to create meaningful impact through transparent, 
            verified donations with real-time tracking and home pickup service.
          </p>
          
          <div class="hero-stats" #heroStats>
            <div class="stat-card hover-lift" *ngFor="let stat of stats" (mouseenter)="createParticles($event)">
              <div class="stat-number count-up">{{ stat.number }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>

          <div class="hero-cta">
            <a (click)="startDonating()" class="btn-primary btn-glow hover-lift" (mouseenter)="createParticles($event)" style="cursor: pointer;">
              <span class="btn-icon">🚀</span>
              Start Donating Now
              <span class="btn-arrow">→</span>
            </a>
            <a routerLink="/nearby-ngos" class="btn-secondary hover-lift" (mouseenter)="createParticles($event)">
              <span class="btn-icon">📍</span>
              Find NGOs Near You
            </a>
          </div>
        </div>

        <!-- Floating Elements -->
        <div class="floating-element float-1">💝</div>
        <div class="floating-element float-2">🤝</div>
        <div class="floating-element float-3">❤️</div>
        <div class="floating-element float-4">🌈</div>
      </section>

      <!-- Website Highlights Section -->
      <section class="highlights-section parallax" #highlightsSection>
        <div class="container">
          <div class="section-header" #sectionHeader>
            <span class="section-badge">Why Choose Us</span>
            <h2 class="section-title">Platform Highlights</h2>
            <p class="section-subtitle">Experience the future of charitable giving with our cutting-edge features</p>
          </div>

          <div class="highlights-grid">
            <div class="highlight-card hover-lift" 
                 *ngFor="let highlight of highlights; let i = index"
                 [attr.data-index]="i"
                 (mouseenter)="createParticles($event)"
                 #highlightCard>
              <div class="highlight-icon-wrapper">
                <div class="icon-background"></div>
                <span class="highlight-icon">{{ highlight.icon }}</span>
              </div>
              <h3 class="highlight-title">{{ highlight.title }}</h3>
              <p class="highlight-description">{{ highlight.description }}</p>
              <ul class="highlight-features">
                <li *ngFor="let feature of highlight.features">
                  <span class="check-icon">✓</span>{{ feature }}
                </li>
              </ul>
              <div class="card-shine"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section class="how-it-works parallax" #howItWorksSection>
        <div class="container">
          <div class="section-header">
            <span class="section-badge">Simple Process</span>
            <h2 class="section-title">How DonateConnect Works</h2>
          </div>

          <div class="steps-container">
            <div class="step-card hover-lift" 
                 *ngFor="let step of steps; let i = index"
                 [class.step-reverse]="i % 2 !== 0"
                 (mouseenter)="createParticles($event)">
              <div class="step-number">{{ i + 1 }}</div>
              <div class="step-content">
                <div class="step-icon">{{ step.icon }}</div>
                <h3>{{ step.title }}</h3>
                <p>{{ step.description }}</p>
              </div>
              <div class="step-line" *ngIf="i < steps.length - 1"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Customer Reviews Section -->
      <section class="reviews-section parallax" #reviewsSection>
        <div class="container">
          <div class="section-header">
            <span class="section-badge">Testimonials</span>
            <h2 class="section-title">What Our Community Says</h2>
            <p class="section-subtitle">Real stories from donors and NGOs making a difference</p>
          </div>

          <div class="reviews-grid">
            <div class="review-card hover-lift" 
                 *ngFor="let review of reviews"
                 [class.new-review]="!review.verified"
                 (mouseenter)="createParticles($event)">
              <div class="review-header">
                <img [src]="review.avatar" [alt]="review.name" class="reviewer-avatar">
                <div class="reviewer-info">
                  <h4 class="reviewer-name">{{ review.name }}</h4>
                  <p class="reviewer-role">{{ review.role }}</p>
                </div>
                <div class="review-rating">
                  <span class="star" *ngFor="let star of [1,2,3,4,5]">
                    {{ star <= review.rating ? '⭐' : '☆' }}
                  </span>
                </div>
              </div>
              <p class="review-text">"{{ review.text }}"</p>
              <div class="review-date">{{ review.date }}</div>
              <div class="review-verified" *ngIf="review.verified">
                <span class="verified-icon">✓</span> Verified Donor
              </div>
              <div class="review-new" *ngIf="!review.verified">
                <span class="new-icon">✨</span> Just Posted
              </div>
            </div>
          </div>

          <!-- Review Stats -->
          <div class="review-stats">
            <div class="review-stat">
              <div class="review-stat-number">4.9/5.0</div>
              <div class="review-stat-label">Average Rating</div>
            </div>
            <div class="review-stat">
              <div class="review-stat-number">5,000+</div>
              <div class="review-stat-label">Happy Donors</div>
            </div>
            <div class="review-stat">
              <div class="review-stat-number">98%</div>
              <div class="review-stat-label">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Give Review Section -->
      <section class="give-review-section parallax" #giveReviewSection>
        <div class="container">
          <div class="review-form-wrapper hover-lift">
            <div class="section-header">
              <span class="section-badge">Share Your Experience</span>
              <h2 class="section-title">Write a Review</h2>
              <p class="section-subtitle">Help others discover the joy of giving</p>
            </div>

            <form class="review-form" (submit)="submitReview($event)">
              <div class="form-group">
                <label for="reviewerName">Your Name *</label>
                <input 
                  type="text" 
                  id="reviewerName" 
                  [(ngModel)]="newReview.name" 
                  name="name"
                  placeholder="Enter your full name"
                  required>
              </div>

              <div class="form-group">
                <label for="reviewerRole">You are a *</label>
                <select id="reviewerRole" [(ngModel)]="newReview.role" name="role" required>
                  <option value="">Select your role</option>
                  <option value="Individual Donor">Individual Donor</option>
                  <option value="Corporate Donor">Corporate Donor</option>
                  <option value="NGO Representative">NGO Representative</option>
                  <option value="Volunteer">Volunteer</option>
                </select>
              </div>

              <div class="form-group">
                <label>Rating *</label>
                <div class="rating-input">
                  <span class="rating-star" 
                        *ngFor="let star of [1,2,3,4,5]"
                        [class.active]="star <= newReview.rating"
                        (click)="setRating(star)"
                        (mouseenter)="hoverRating = star"
                        (mouseleave)="hoverRating = 0">
                    {{ star <= (hoverRating || newReview.rating) ? '⭐' : '☆' }}
                  </span>
                </div>
              </div>

              <div class="form-group">
                <label for="reviewText">Your Review *</label>
                <textarea 
                  id="reviewText" 
                  [(ngModel)]="newReview.text" 
                  name="text"
                  rows="5" 
                  placeholder="Share your experience with DonateConnect..."
                  required></textarea>
              </div>

              <button type="submit" class="btn-primary btn-glow hover-lift" (mouseenter)="createParticles($event)">
                <span class="btn-icon">📝</span>
                Submit Review
              </button>

              <div class="form-success" *ngIf="reviewSubmitted">
                <span class="success-icon">✓</span>
                Thank you! Your review has been submitted successfully.
              </div>
            </form>
          </div>
        </div>
      </section>

      <!-- Review Popup Modal -->
      <div class="review-popup-overlay" *ngIf="showReviewPopup" (click)="closeReviewPopup()">
        <div class="review-popup" (click)="$event.stopPropagation()">
          <button class="popup-close" (click)="closeReviewPopup()">✕</button>
          
          <div class="popup-header">
            <div class="popup-success-icon">
              <span class="checkmark">✓</span>
            </div>
            <h3 class="popup-title">Review Submitted Successfully!</h3>
            <p class="popup-subtitle">Thank you for sharing your experience</p>
          </div>

          <div class="popup-review-preview">
            <div class="preview-header">
              <div class="preview-avatar">
                <span class="avatar-initial">{{ submittedReview.name?.charAt(0) }}</span>
              </div>
              <div class="preview-info">
                <h4 class="preview-name">{{ submittedReview.name }}</h4>
                <p class="preview-role">{{ submittedReview.role }}</p>
              </div>
              <div class="preview-rating">
                <span class="star" *ngFor="let star of [1,2,3,4,5]">
                  {{ star <= submittedReview.rating ? '⭐' : '☆' }}
                </span>
              </div>
            </div>
            
            <p class="preview-text">"{{ submittedReview.text }}"</p>
            
            <div class="preview-meta">
              <span class="preview-date">{{ submittedReview.date }}</span>
              <span class="preview-status">
                <span class="status-icon">⏳</span>
                Pending Verification
              </span>
            </div>
          </div>

          <div class="popup-actions">
            <button class="btn-popup-primary" (click)="closeReviewPopup()">
              <span class="btn-icon">👍</span>
              Got it!
            </button>
            <button class="btn-popup-secondary" (click)="writeAnotherReview()">
              Write Another Review
            </button>
          </div>

          <p class="popup-note">
            Your review will be visible after our team verifies it (usually within 24 hours)
          </p>
        </div>
      </div>

      <!-- Call to Action -->
      <section class="cta-section parallax" #ctaSection>
        <div class="cta-content">
          <h2 class="cta-title">Ready to Make a Difference?</h2>
          <p class="cta-subtitle">Join thousands of donors and NGOs creating positive impact every day</p>
          <div class="cta-buttons">
            <a (click)="startDonating()" class="btn-primary btn-glow btn-large hover-lift" (mouseenter)="createParticles($event)" style="cursor: pointer;">
              Get Started Today
            </a>
            <a routerLink="/nearby-ngos" class="btn-secondary btn-large hover-lift" (mouseenter)="createParticles($event)">
              Explore NGOs
            </a>
          </div>
        </div>
        <div class="cta-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    /* Reset & Base */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .home-wrapper {
      position: relative;
      overflow-x: hidden;
      background: #0a0a0a;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    /* Particles Background */
    .particles-container {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    }

    /* Hero Section */
    .hero-section {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      z-index: 1;
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 50%, rgba(102, 126, 234, 0.1), rgba(10, 10, 10, 0.9));
      z-index: 1;
    }

    .hero-content {
      position: relative;
      z-index: 2;
      text-align: center;
      max-width: 900px;
      animation: fadeInUp 1s ease-out;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50px;
      color: #fff;
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 2rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .badge-icon {
      font-size: 1.2rem;
    }

    .pulse-animation {
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      }
      50% {
        transform: scale(1.05);
        box-shadow: 0 12px 40px rgba(102, 126, 234, 0.5);
      }
    }

    .hero-title {
      font-size: clamp(2.5rem, 8vw, 5rem);
      font-weight: 900;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      color: #fff;
    }

    .gradient-text {
      background: linear-gradient(135deg, #fff 0%, #f093fb 50%, #feca57 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: gradientShift 3s ease infinite;
      background-size: 200% 200%;
    }

    @keyframes gradientShift {
      0%, 100% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
    }

    .highlight {
      display: inline-block;
      position: relative;
      color: #feca57;
    }

    .hero-subtitle {
      font-size: clamp(1rem, 2vw, 1.3rem);
      color: rgba(255, 255, 255, 0.8);
      max-width: 700px;
      margin: 0 auto 3rem;
      line-height: 1.7;
    }

    .hero-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 2rem;
      margin: 3rem auto;
      max-width: 700px;
    }

    .stat-card {
      padding: 2rem 1rem;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, #feca57, #ff6b6b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.7);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .hero-cta {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 3rem;
    }

    .btn-primary, .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1.2rem 2.5rem;
      font-size: 1.1rem;
      font-weight: 700;
      border-radius: 50px;
      text-decoration: none;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      border: 2px solid transparent;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: #fff;
      box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
    }

    .btn-glow {
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

    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      color: #fff;
      border-color: rgba(255, 255, 255, 0.3);
    }

    .btn-icon {
      font-size: 1.3rem;
    }

    .btn-arrow {
      transition: transform 0.3s ease;
    }

    .btn-primary:hover .btn-arrow {
      transform: translateX(5px);
    }

    .hover-lift {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .hover-lift:hover {
      transform: translateY(-10px) scale(1.05);
    }

    .stat-card:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(102, 126, 234, 0.5);
      box-shadow: 0 20px 60px rgba(102, 126, 234, 0.4);
    }

    /* Floating Elements */
    .floating-element {
      position: absolute;
      font-size: 3rem;
      opacity: 0.6;
      pointer-events: none;
      z-index: 1;
    }

    .float-1 {
      top: 20%;
      left: 10%;
      animation: float 6s ease-in-out infinite;
    }

    .float-2 {
      top: 60%;
      right: 15%;
      animation: float 7s ease-in-out infinite 1s;
    }

    .float-3 {
      bottom: 20%;
      left: 20%;
      animation: float 8s ease-in-out infinite 2s;
    }

    .float-4 {
      top: 40%;
      right: 25%;
      animation: float 9s ease-in-out infinite 1.5s;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0) rotate(0deg);
      }
      50% {
        transform: translateY(-30px) rotate(10deg);
      }
    }

    /* Highlights Section */
    .highlights-section {
      position: relative;
      padding: 8rem 2rem;
      background: linear-gradient(180deg, rgba(10, 10, 10, 0.95), rgba(18, 18, 18, 1));
      z-index: 1;
    }

    .section-header {
      text-align: center;
      margin-bottom: 4rem;
      animation: fadeInUp 0.8s ease-out;
    }

    .section-badge {
      display: inline-block;
      padding: 0.5rem 1.5rem;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
      border: 1px solid rgba(102, 126, 234, 0.3);
      border-radius: 50px;
      color: #667eea;
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 1rem;
    }

    .section-title {
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 800;
      background: linear-gradient(135deg, #fff, #667eea);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 1rem;
    }

    .section-subtitle {
      font-size: 1.2rem;
      color: rgba(255, 255, 255, 0.6);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    .highlights-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2.5rem;
      margin-top: 4rem;
    }

    .highlight-card {
      position: relative;
      padding: 3rem;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      overflow: hidden;
    }

    .highlight-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(240, 147, 251, 0.1));
      opacity: 0;
      transition: opacity 0.5s ease;
    }

    .highlight-card:hover::before {
      opacity: 1;
    }

    .highlight-card:hover {
      border-color: rgba(102, 126, 234, 0.5);
      box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
      transform: translateY(-10px) scale(1.02);
    }

    .highlight-icon-wrapper {
      position: relative;
      width: 80px;
      height: 80px;
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon-background {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 20px;
      opacity: 0.15;
      transform: rotate(-5deg);
      transition: all 0.4s ease;
    }

    .highlight-card:hover .icon-background {
      opacity: 0.3;
      transform: rotate(5deg) scale(1.1);
    }

    .highlight-icon {
      position: relative;
      font-size: 2.5rem;
      z-index: 1;
    }

    .highlight-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 1rem;
    }

    .highlight-description {
      font-size: 1.05rem;
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.7;
      margin-bottom: 1.5rem;
    }

    .highlight-features {
      list-style: none;
      padding: 0;
    }

    .highlight-features li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 0;
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.95rem;
    }

    .check-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: #fff;
      border-radius: 50%;
      font-weight: bold;
      font-size: 0.8rem;
      flex-shrink: 0;
    }

    .card-shine {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      transform: rotate(45deg);
      transition: transform 0.6s ease;
    }

    .highlight-card:hover .card-shine {
      transform: translateX(100%) translateY(100%) rotate(45deg);
    }

    /* How It Works Section */
    .how-it-works {
      position: relative;
      padding: 8rem 2rem;
      background: linear-gradient(180deg, rgba(18, 18, 18, 1), rgba(10, 10, 10, 0.95));
      z-index: 1;
    }

    .steps-container {
      display: grid;
      gap: 4rem;
      margin-top: 4rem;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }

    .step-card {
      display: grid;
      grid-template-columns: 80px 1fr;
      gap: 2rem;
      align-items: center;
      position: relative;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      transition: all 0.4s ease;
    }

    .step-card:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(102, 126, 234, 0.5);
    }

    .step-number {
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: #fff;
      border-radius: 50%;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    }

    .step-content {
      text-align: left;
    }

    .step-icon {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .step-content h3 {
      font-size: 1.5rem;
      color: #fff;
      margin-bottom: 0.75rem;
    }

    .step-content p {
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.6;
    }

    /* Reviews Section */
    .reviews-section {
      position: relative;
      padding: 8rem 2rem;
      background: linear-gradient(180deg, rgba(10, 10, 10, 0.95), rgba(18, 18, 18, 1));
      z-index: 1;
    }

    .reviews-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2.5rem;
      margin-top: 4rem;
    }

    .review-card {
      padding: 2.5rem;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      transition: all 0.4s ease;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .review-card.new-review {
      background: rgba(102, 126, 234, 0.08);
      border-color: rgba(102, 126, 234, 0.4);
      animation: newReviewGlow 2s ease-in-out infinite;
    }

    @keyframes newReviewGlow {
      0%, 100% {
        box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
      }
      50% {
        box-shadow: 0 0 40px rgba(102, 126, 234, 0.5);
      }
    }

    .review-card.new-review::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      animation: shimmer 3s ease-in-out infinite;
    }

    @keyframes shimmer {
      0% {
        left: -100%;
      }
      50%, 100% {
        left: 100%;
      }
    }

    .review-card:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(102, 126, 234, 0.5);
      box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
    }

    .review-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .reviewer-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 3px solid rgba(102, 126, 234, 0.5);
      object-fit: cover;
    }

    .reviewer-info {
      flex: 1;
    }

    .reviewer-name {
      font-size: 1.1rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.25rem;
    }

    .reviewer-role {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.6);
    }

    .review-rating {
      display: flex;
      gap: 0.25rem;
    }

    .star {
      font-size: 1rem;
    }

    .review-text {
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.7;
      margin-bottom: 1rem;
      font-style: italic;
    }

    .review-date {
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 0.5rem;
    }

    .review-verified {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(34, 197, 94, 0.2);
      border: 1px solid rgba(34, 197, 94, 0.3);
      border-radius: 20px;
      color: #22c55e;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .verified-icon {
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #22c55e;
      color: #fff;
      border-radius: 50%;
      font-size: 0.7rem;
    }

    .review-new {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(254, 202, 87, 0.2);
      border: 1px solid rgba(254, 202, 87, 0.3);
      border-radius: 20px;
      color: #feca57;
      font-size: 0.85rem;
      font-weight: 600;
      animation: pulse 2s ease-in-out infinite;
    }

    .new-icon {
      font-size: 1rem;
      animation: sparkle 1.5s ease-in-out infinite;
    }

    @keyframes sparkle {
      0%, 100% {
        transform: scale(1) rotate(0deg);
      }
      25% {
        transform: scale(1.2) rotate(10deg);
      }
      75% {
        transform: scale(1.2) rotate(-10deg);
      }
    }

    .review-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      margin-top: 4rem;
      padding: 3rem;
      background: rgba(102, 126, 234, 0.1);
      border: 1px solid rgba(102, 126, 234, 0.3);
      border-radius: 20px;
    }

    .review-stat {
      text-align: center;
    }

    .review-stat-number {
      font-size: 3rem;
      font-weight: 800;
      background: linear-gradient(135deg, #feca57, #ff6b6b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
    }

    .review-stat-label {
      color: rgba(255, 255, 255, 0.7);
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* Give Review Section */
    .give-review-section {
      position: relative;
      padding: 8rem 2rem;
      background: linear-gradient(180deg, rgba(18, 18, 18, 1), rgba(10, 10, 10, 0.95));
      z-index: 1;
    }

    .review-form-wrapper {
      max-width: 700px;
      margin: 0 auto;
      padding: 3rem;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
    }

    .review-form {
      margin-top: 2rem;
    }

    .form-group {
      margin-bottom: 2rem;
    }

    .form-group label {
      display: block;
      color: #fff;
      font-weight: 600;
      margin-bottom: 0.75rem;
      font-size: 1rem;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 1rem 1.5rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      color: #fff;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(102, 126, 234, 0.5);
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-group textarea {
      resize: vertical;
      min-height: 120px;
    }

    .rating-input {
      display: flex;
      gap: 0.5rem;
      font-size: 2rem;
    }

    .rating-star {
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .rating-star:hover {
      transform: scale(1.2);
    }

    .rating-star.active {
      filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
    }

    .form-success {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: rgba(34, 197, 94, 0.2);
      border: 1px solid rgba(34, 197, 94, 0.3);
      border-radius: 12px;
      color: #22c55e;
      font-weight: 600;
      margin-top: 2rem;
      animation: slideInUp 0.5s ease-out;
    }

    .success-icon {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #22c55e;
      color: #fff;
      border-radius: 50%;
      font-size: 1.2rem;
    }

    /* CTA Section */
    .cta-section {
      position: relative;
      padding: 8rem 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      z-index: 1;
      overflow: hidden;
    }

    .cta-content {
      position: relative;
      z-index: 2;
      text-align: center;
      max-width: 800px;
      margin: 0 auto;
    }

    .cta-title {
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 800;
      color: #fff;
      margin-bottom: 1.5rem;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .cta-subtitle {
      font-size: 1.3rem;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 3rem;
      line-height: 1.6;
    }

    .cta-buttons {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-large {
      padding: 1.5rem 3rem;
      font-size: 1.2rem;
    }

    .cta-shapes {
      position: absolute;
      inset: 0;
      z-index: 1;
      overflow: hidden;
    }

    .shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      opacity: 0.3;
      animation: shapeFloat 20s ease-in-out infinite;
    }

    .shape-1 {
      width: 400px;
      height: 400px;
      background: rgba(255, 255, 255, 0.3);
      top: -100px;
      left: -100px;
    }

    .shape-2 {
      width: 300px;
      height: 300px;
      background: rgba(240, 147, 251, 0.3);
      bottom: -50px;
      right: -50px;
      animation-delay: 2s;
    }

    .shape-3 {
      width: 500px;
      height: 500px;
      background: rgba(102, 126, 234, 0.3);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation-delay: 4s;
    }

    @keyframes shapeFloat {
      0%, 100% {
        transform: translate(0, 0) scale(1);
      }
      33% {
        transform: translate(30px, -30px) scale(1.1);
      }
      66% {
        transform: translate(-30px, 30px) scale(0.9);
      }
    }

    /* Review Popup Modal */
    .review-popup-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 2rem;
      animation: fadeIn 0.3s ease-out;
    }

    .review-popup {
      position: relative;
      max-width: 600px;
      width: 100%;
      background: linear-gradient(135deg, rgba(18, 18, 18, 0.98), rgba(30, 30, 30, 0.98));
      border: 1px solid rgba(102, 126, 234, 0.3);
      border-radius: 24px;
      padding: 3rem;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5), 0 0 100px rgba(102, 126, 234, 0.3);
      animation: popupSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      max-height: 90vh;
      overflow-y: auto;
    }

    .popup-close {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      color: #fff;
      font-size: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .popup-close:hover {
      background: rgba(255, 59, 59, 0.2);
      border-color: rgba(255, 59, 59, 0.5);
      transform: rotate(90deg);
    }

    .popup-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .popup-success-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem;
      background: linear-gradient(135deg, #22c55e, #16a34a);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 30px rgba(34, 197, 94, 0.4);
      animation: successPulse 1.5s ease-in-out infinite;
    }

    .checkmark {
      font-size: 2.5rem;
      color: #fff;
      font-weight: bold;
    }

    @keyframes successPulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 10px 30px rgba(34, 197, 94, 0.4);
      }
      50% {
        transform: scale(1.05);
        box-shadow: 0 15px 40px rgba(34, 197, 94, 0.6);
      }
    }

    .popup-title {
      font-size: 2rem;
      font-weight: 800;
      background: linear-gradient(135deg, #fff, #22c55e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
    }

    .popup-subtitle {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.7);
    }

    .popup-review-preview {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 2rem;
    }

    .preview-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .preview-avatar {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .avatar-initial {
      font-size: 1.5rem;
      font-weight: 700;
      color: #fff;
      text-transform: uppercase;
    }

    .preview-info {
      flex: 1;
      min-width: 150px;
    }

    .preview-name {
      font-size: 1.2rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.25rem;
    }

    .preview-role {
      font-size: 0.95rem;
      color: rgba(255, 255, 255, 0.6);
    }

    .preview-rating {
      display: flex;
      gap: 0.25rem;
    }

    .preview-rating .star {
      font-size: 1.2rem;
    }

    .preview-text {
      color: rgba(255, 255, 255, 0.85);
      line-height: 1.7;
      font-size: 1.05rem;
      margin-bottom: 1.5rem;
      font-style: italic;
      padding-left: 1rem;
      border-left: 3px solid rgba(102, 126, 234, 0.5);
    }

    .preview-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .preview-date {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.5);
    }

    .preview-status {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(254, 202, 87, 0.2);
      border: 1px solid rgba(254, 202, 87, 0.3);
      border-radius: 20px;
      color: #feca57;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .status-icon {
      font-size: 1rem;
    }

    .popup-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .btn-popup-primary,
    .btn-popup-secondary {
      flex: 1;
      min-width: 200px;
      padding: 1rem 2rem;
      font-size: 1rem;
      font-weight: 700;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-popup-primary {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: #fff;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    }

    .btn-popup-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 40px rgba(102, 126, 234, 0.6);
    }

    .btn-popup-secondary {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
    }

    .btn-popup-secondary:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }

    .popup-note {
      text-align: center;
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.5);
      line-height: 1.5;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    /* Animations */
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes popupSlideIn {
      from {
        opacity: 0;
        transform: scale(0.8) translateY(30px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
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

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Parallax Effect */
    .parallax {
      transform-style: preserve-3d;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .hero-stats {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
      }

      .hero-cta {
        flex-direction: column;
        align-items: stretch;
      }

      .btn-primary, .btn-secondary {
        justify-content: center;
      }

      .highlights-grid,
      .reviews-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .step-card {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .step-number {
        margin: 0 auto;
      }

      .step-content {
        text-align: center;
      }

      .review-form-wrapper {
        padding: 2rem;
      }

      .cta-buttons {
        flex-direction: column;
        align-items: stretch;
      }

      .floating-element {
        font-size: 2rem;
      }

      .review-popup {
        padding: 2rem;
      }

      .popup-actions {
        flex-direction: column;
      }

      .btn-popup-primary,
      .btn-popup-secondary {
        width: 100%;
        min-width: auto;
      }

      .preview-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .preview-rating {
        width: 100%;
      }
    }

    @media (max-width: 480px) {
      .hero-section,
      .highlights-section,
      .how-it-works,
      .reviews-section,
      .give-review-section,
      .cta-section {
        padding: 4rem 1rem;
      }

      .stat-number {
        font-size: 2rem;
      }

      .highlight-card,
      .review-card {
        padding: 2rem;
      }

      .review-popup {
        padding: 1.5rem;
      }

      .popup-title {
        font-size: 1.5rem;
      }

      .popup-success-icon {
        width: 60px;
        height: 60px;
      }

      .checkmark {
        font-size: 2rem;
      }

      .popup-review-preview {
        padding: 1.5rem;
      }

      .review-popup-overlay {
        padding: 1rem;
      }
    }
  `]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroSection') heroSection!: ElementRef;
  @ViewChild('highlightsSection') highlightsSection!: ElementRef;
  @ViewChild('reviewsSection') reviewsSection!: ElementRef;

  private isBrowser: boolean;
  private scrollListener: any;

  stats = [
    { number: '500+', label: 'Verified NGOs' },
    { number: '10K+', label: 'Active Donors' },
    { number: '₹50L+', label: 'Total Donated' },
    { number: '100+', label: 'Cities Covered' }
  ];

  highlights = [
    {
      icon: '🎯',
      title: 'Verified NGO Network',
      description: 'Connect with 500+ thoroughly verified NGOs across India working on diverse causes.',
      features: [
        'Government-verified organizations',
        'Regular audits and compliance checks',
        'Transparent financial reporting',
        'Impact tracking and documentation'
      ]
    },
    {
      icon: '🔒',
      title: 'Secure Payment Gateway',
      description: 'Multiple payment options with bank-grade security and instant receipts.',
      features: [
        'Razorpay integration with encryption',
        'UPI, Cards, Net Banking support',
        '80G tax exemption certificates',
        'Instant payment confirmations'
      ]
    },
    {
      icon: '📍',
      title: 'Doorstep Pickup Service',
      description: 'Schedule convenient pickup times for your donations with real-time tracking.',
      features: [
        'GPS-enabled pickup tracking',
        'Flexible scheduling options',
        'SMS and email notifications',
        'Professional pickup personnel'
      ]
    },
    {
      icon: '📊',
      title: 'Impact Dashboard',
      description: 'Track your contributions and see the real-world impact of your donations.',
      features: [
        'Personalized donor dashboard',
        'Donation history and analytics',
        'NGO progress reports',
        'Impact stories and updates'
      ]
    },
    {
      icon: '🌐',
      title: 'Geolocation Search',
      description: 'Discover NGOs near you and support local causes in your community.',
      features: [
        'Location-based NGO discovery',
        'Filter by cause and distance',
        'Map view with directions',
        'Local impact visualization'
      ]
    },
    {
      icon: '✅',
      title: 'Complete Transparency',
      description: 'Every donation is tracked from donation to delivery with full accountability.',
      features: [
        'Real-time status updates',
        'Photo verification of deliveries',
        'Beneficiary feedback system',
        'Fund utilization reports'
      ]
    }
  ];

  steps = [
    {
      icon: '📝',
      title: 'Sign Up & Browse',
      description: 'Create your free account and explore verified NGOs working on causes you care about. Filter by location, category, and impact.'
    },
    {
      icon: '💝',
      title: 'Choose & Donate',
      description: 'Select an NGO and make a secure donation using your preferred payment method. Get instant receipt and 80G certificate.'
    },
    {
      icon: '🚚',
      title: 'Schedule Pickup',
      description: 'For physical donations, schedule a convenient pickup time. Our verified personnel will collect items from your doorstep.'
    },
    {
      icon: '📈',
      title: 'Track Impact',
      description: 'Monitor your donation status in real-time and receive updates on how your contribution is making a difference.'
    }
  ];

  reviews = [
    {
      name: 'Priya Sharma',
      role: 'Individual Donor',
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      text: 'DonateConnect has transformed how I give to charity. The transparency and ease of tracking my donations gives me confidence that my contributions are making a real difference. The doorstep pickup service is incredibly convenient!',
      date: 'October 15, 2025',
      verified: true
    },
    {
      name: 'Rajesh Kumar',
      role: 'Corporate Donor',
      avatar: 'https://i.pravatar.cc/150?img=12',
      rating: 5,
      text: 'We have been using DonateConnect for our company CSR initiatives. The platform makes it easy to manage multiple donations, and the detailed impact reports help us showcase our social responsibility to stakeholders.',
      date: 'October 10, 2025',
      verified: true
    },
    {
      name: 'Anjali Mehta',
      role: 'NGO Representative',
      avatar: 'https://i.pravatar.cc/150?img=5',
      rating: 5,
      text: 'As an NGO, this platform has been a game-changer. The verification process was thorough but fair, and now we receive regular donations from donors who trust our work. The dashboard helps us manage everything efficiently.',
      date: 'October 8, 2025',
      verified: true
    },
    {
      name: 'Vikram Singh',
      role: 'Individual Donor',
      avatar: 'https://i.pravatar.cc/150?img=8',
      rating: 5,
      text: 'I love the geolocation feature! I can support NGOs in my neighborhood and see the local impact of my donations. The platform is user-friendly, and customer support is always helpful.',
      date: 'October 5, 2025',
      verified: true
    },
    {
      name: 'Sneha Patel',
      role: 'Regular Donor',
      avatar: 'https://i.pravatar.cc/150?img=9',
      rating: 5,
      text: 'The mobile app makes donating on-the-go so easy. I set up monthly recurring donations to my favorite causes, and I get regular updates on how the funds are being used. Highly recommend!',
      date: 'October 2, 2025',
      verified: true
    },
    {
      name: 'Amit Desai',
      role: 'Volunteer',
      avatar: 'https://i.pravatar.cc/150?img=13',
      rating: 5,
      text: 'Been volunteering with NGOs listed on DonateConnect for over a year. The platform not only facilitates donations but also creates a community of givers. The impact stories inspire me to do more.',
      date: 'September 28, 2025',
      verified: true
    }
  ];

  newReview = {
    name: '',
    role: '',
    rating: 0,
    text: ''
  };

  submittedReview: any = {};
  showReviewPopup = false;
  hoverRating = 0;
  reviewSubmitted = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private auth: AuthService,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.initParticles();
      this.loadReviews();
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.initScrollAnimations();
      this.initParallaxEffect();
    }
  }

  ngOnDestroy() {
    if (this.isBrowser && this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  // Navigate to nearby NGOs if logged in, otherwise to signup
  startDonating() {
    const isLoggedIn = this.auth.isLoggedIn();
    if (isLoggedIn) {
      this.router.navigate(['/nearby-ngos']);
    } else {
      this.router.navigate(['/signup']);
    }
  }

  initParticles() {
    if (typeof particlesJS !== 'undefined') {
      particlesJS('particles-js', {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: ['#ffffff', '#667eea', '#764ba2', '#f093fb'] },
          shape: { type: 'circle' },
          opacity: {
            value: 0.5,
            random: true,
            anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
          },
          size: {
            value: 3,
            random: true,
            anim: { enable: true, speed: 2, size_min: 0.1, sync: false }
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.2,
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
          },
          modes: {
            repulse: { distance: 100, duration: 0.4 },
            push: { particles_nb: 4 }
          }
        },
        retina_detect: true
      });
    }
  }

  initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.highlight-card, .step-card, .review-card');
    elements.forEach(el => observer.observe(el));
  }

  initParallaxEffect() {
    this.scrollListener = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax');
      
      parallaxElements.forEach((el: any) => {
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        el.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    };

    window.addEventListener('scroll', this.scrollListener);
  }

  createParticles(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const colors = ['#667eea', '#764ba2', '#f093fb'];
    const particleCount = 5;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.width = '6px';
      particle.style.height = '6px';
      particle.style.borderRadius = '50%';
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '1000';
      
      target.appendChild(particle);

      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 1.5 + Math.random() * 1.5;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;

      let posX = x;
      let posY = y;
      let opacity = 1;

      const animate = () => {
        posX += vx;
        posY += vy;
        opacity -= 0.03;

        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        particle.style.opacity = `${opacity}`;

        if (opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          particle.remove();
        }
      };

      animate();
    }
  }

  setRating(rating: number) {
    this.newReview.rating = rating;
  }

  loadReviews() {
    this.http.get<any[]>('/api/reviews').subscribe({
      next: (reviews) => {
        // Map reviews to include avatar URL
        this.reviews = reviews.map(review => ({
          ...review,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=667eea&color=fff&size=150`,
          date: new Date(review.createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })
        }));
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        // Keep default reviews if API fails
      }
    });
  }

  submitReview(event: Event) {
    event.preventDefault();
    
    if (this.newReview.name && this.newReview.role && this.newReview.rating && this.newReview.text) {
      // Submit to backend
      this.http.post<any>('/api/reviews', this.newReview).subscribe({
        next: (savedReview) => {
          // Create submitted review object with data from server
          this.submittedReview = {
            ...savedReview,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(savedReview.name)}&background=667eea&color=fff&size=150`,
            date: new Date(savedReview.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })
          };
          
          // Add the new review to the beginning of the reviews array
          this.reviews.unshift(this.submittedReview);
          
          console.log('Review submitted successfully:', this.submittedReview);
          
          // Show success message briefly
          this.reviewSubmitted = true;
          
          // Show popup after brief delay
          setTimeout(() => {
            this.reviewSubmitted = false;
            this.showReviewPopup = true;
            
            // Scroll to reviews section after popup appears
            setTimeout(() => {
              if (this.isBrowser && this.reviewsSection) {
                this.reviewsSection.nativeElement.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'start' 
                });
              }
            }, 300);
          }, 500);
        },
        error: (error) => {
          console.error('Error submitting review:', error);
          alert('Failed to submit review. Please try again.');
          this.reviewSubmitted = false;
        }
      });
    }
  }

  closeReviewPopup() {
    this.showReviewPopup = false;
    // Reset form
    this.newReview = { name: '', role: '', rating: 0, text: '' };
    
    // Scroll to reviews section to show the new review
    if (this.isBrowser && this.reviewsSection) {
      setTimeout(() => {
        this.reviewsSection.nativeElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 300);
    }
  }

  writeAnotherReview() {
    this.showReviewPopup = false;
    this.newReview = { name: '', role: '', rating: 0, text: '' };
    
    // Scroll to review form
    if (this.isBrowser) {
      const reviewForm = document.querySelector('.give-review-section');
      reviewForm?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}
