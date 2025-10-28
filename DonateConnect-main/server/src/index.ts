import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import path from 'path';

import authRoutes from './routes/auth';
import ngoRoutes from './routes/ngo';
import donationRoutes from './routes/donation';
import paymentRoutes from './routes/payment';
import adminRoutes from './routes/admin';
import reviewRoutes from './routes/review';
import fs from 'fs';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(path.join(process.cwd(), uploadDir))) {
  fs.mkdirSync(path.join(process.cwd(), uploadDir), { recursive: true });
}
app.use('/uploads', express.static(path.join(process.cwd(), uploadDir)));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/ngos', ngoRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);

// Serve built Angular app (must come AFTER API routes)
const clientDist = path.join(__dirname, '..', '..', 'client', 'dist', 'donateconnect-client', 'browser');
app.use(express.static(clientDist));

// SPA fallback - send index.html for all non-API routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/donateconnect';
mongoose
  .connect(mongoUri)
  .then(() => {
    const port = Number(process.env.PORT) || 4200;
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`✅ DonateConnect running on http://localhost:${port}`);
      console.log(`📡 API: http://localhost:${port}/api`);
      console.log(`🏥 Health: http://localhost:${port}/health`);
    });

    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${port} is already in use`);
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error('❌ Mongo connection error', err);
    process.exit(1);
  });

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

export default app;
