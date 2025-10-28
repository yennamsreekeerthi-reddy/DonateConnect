import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';

const run = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/donateconnect';
  await mongoose.connect(mongoUri);
  const email = 'admin@donateconnect.local';
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin already exists');
  } else {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await User.create({ name: 'Admin', email, passwordHash, role: 'ADMIN' });
    console.log('Admin created: admin@donateconnect.local / admin123');
  }
  await mongoose.disconnect();
};

run().catch((e) => { console.error(e); process.exit(1); });
