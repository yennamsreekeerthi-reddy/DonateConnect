import OTP from '../models/OTP';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export class OTPService {
  /**
   * Generate a 6-digit OTP
   */
  static generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  /**
   * Create and save OTP to database
   */
  static async createOTP(email: string, type: 'signup' | 'login' | 'reset'): Promise<string> {
    // Delete any existing OTPs for this email and type
    await OTP.deleteMany({ email, type });

    const otp = this.generateOTP();
    
    await OTP.create({
      email,
      otp,
      type,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    return otp;
  }

  /**
   * Verify OTP
   */
  static async verifyOTP(email: string, otp: string, type: 'signup' | 'login' | 'reset'): Promise<boolean> {
    const otpDoc = await OTP.findOne({
      email,
      otp,
      type,
      verified: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpDoc) {
      return false;
    }

    // Mark as verified
    otpDoc.verified = true;
    await otpDoc.save();

    return true;
  }

  /**
   * Send OTP via email
   */
  static async sendOTP(email: string, otp: string, type: string): Promise<void> {
    // Console log for development
    console.log(`\n📧 OTP Email to ${email}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Type: ${type.toUpperCase()}`);
    console.log(`OTP Code: ${otp}`);
    console.log(`Valid for: 10 minutes`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

    try {
      // Create transporter using Gmail
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER, // Your Gmail address
          pass: process.env.EMAIL_PASS  // Your Gmail App Password
        }
      });

      // Email HTML template
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 40px;
              border-radius: 10px;
              text-align: center;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 8px;
              margin-top: 20px;
            }
            .logo {
              font-size: 48px;
              margin-bottom: 20px;
            }
            h1 {
              color: white;
              margin: 0;
            }
            .otp-code {
              font-size: 36px;
              font-weight: bold;
              color: #667eea;
              letter-spacing: 8px;
              padding: 20px;
              background: #f5f5f5;
              border-radius: 8px;
              margin: 20px 0;
            }
            .info {
              color: #666;
              font-size: 14px;
            }
            .footer {
              margin-top: 20px;
              color: white;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">🎯</div>
            <h1>DonateConnect</h1>
            <div class="content">
              <h2>Your Login OTP</h2>
              <p>Use this OTP to complete your login:</p>
              <div class="otp-code">${otp}</div>
              <p class="info">⏱️ This OTP will expire in 10 minutes</p>
              <p class="info">🔒 Please do not share this code with anyone</p>
            </div>
            <div class="footer">
              <p>If you didn't request this OTP, please ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Send email
      await transporter.sendMail({
        from: `"DonateConnect" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Your DonateConnect Login OTP - ${otp}`,
        text: `Your OTP for ${type} is: ${otp}. Valid for 10 minutes.`,
        html: htmlContent
      });

      console.log(`✅ Email sent successfully to ${email}`);
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      // Don't throw error - OTP is still logged to console as fallback
    }
  }
}
