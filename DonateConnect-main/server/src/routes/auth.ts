import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import { OTPService } from '../services/otpService';

const router = Router();

router.post('/signup',
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['DONOR', 'NGO']).withMessage('Role must be DONOR or NGO'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation error', 
          errors: errors.array() 
        });
      }
      
      const { name, email, password, role } = req.body;
      
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ 
          message: 'Email already registered. Please use a different email or login.' 
        });
      }
      
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ 
        name, 
        email, 
        passwordHash, 
        role: role || 'DONOR' 
      });
      
      const token = jwt.sign(
        { id: user.id, role: user.role }, 
        process.env.JWT_SECRET || 'changeme', 
        { expiresIn: '7d' }
      );
      
      res.status(201).json({ 
        token, 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        } 
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ 
        message: 'Server error during signup. Please try again.' 
      });
    }
  }
);

router.post('/login',
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation error', 
          errors: errors.array() 
        });
      }
      
      const { email, password } = req.body;
      
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ 
          message: 'Invalid email or password' 
        });
      }
      
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) {
        return res.status(401).json({ 
          message: 'Invalid email or password' 
        });
      }
      
      const token = jwt.sign(
        { id: user.id, role: user.role }, 
        process.env.JWT_SECRET || 'changeme', 
        { expiresIn: '7d' }
      );
      
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        } 
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        message: 'Server error during login. Please try again.' 
      });
    }
  }
);

// Request OTP for login
router.post('/request-login-otp',
  body('email').isEmail().withMessage('Valid email is required'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation error', 
          errors: errors.array() 
        });
      }
      
      const { email } = req.body;
      
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ 
          message: 'No account found with this email address' 
        });
      }
      
      // Generate and send OTP
      const otp = await OTPService.createOTP(email, 'login');
      await OTPService.sendOTP(email, otp, 'login');
      
      res.json({ 
        message: 'OTP sent to your email. Please check your inbox.',
        email: email 
      });
    } catch (error) {
      console.error('OTP request error:', error);
      res.status(500).json({ 
        message: 'Server error while sending OTP. Please try again.' 
      });
    }
  }
);

// Login with OTP
router.post('/login-with-otp',
  body('email').isEmail().withMessage('Valid email is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation error', 
          errors: errors.array() 
        });
      }
      
      const { email, otp } = req.body;
      
      // Verify OTP
      const isValid = await OTPService.verifyOTP(email, otp, 'login');
      if (!isValid) {
        return res.status(401).json({ 
          message: 'Invalid or expired OTP. Please request a new one.' 
        });
      }
      
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ 
          message: 'User not found' 
        });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, role: user.role }, 
        process.env.JWT_SECRET || 'changeme', 
        { expiresIn: '7d' }
      );
      
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        },
        message: 'Login successful' 
      });
    } catch (error) {
      console.error('OTP login error:', error);
      res.status(500).json({ 
        message: 'Server error during OTP login. Please try again.' 
      });
    }
  }
);

export default router;
