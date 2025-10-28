import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';

const seedUsers = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/donateconnect';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Check if admin exists
    const existingAdmin = await User.findOne({ role: 'ADMIN' });
    if (!existingAdmin) {
      const adminPasswordHash = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Admin User',
        email: 'admin@donateconnect.local',
        passwordHash: adminPasswordHash,
        role: 'ADMIN'
      });
      console.log('✅ Created Admin Account');
      console.log('   📧 Email: admin@donateconnect.local');
      console.log('   🔑 Password: admin123\n');
    } else {
      console.log('ℹ️  Admin account already exists\n');
    }

    // Check if sample donor exists
    const existingDonor = await User.findOne({ email: 'donor@example.com' });
    if (!existingDonor) {
      const donorPasswordHash = await bcrypt.hash('donor123', 10);
      await User.create({
        name: 'Sample Donor',
        email: 'donor@example.com',
        passwordHash: donorPasswordHash,
        role: 'DONOR'
      });
      console.log('✅ Created Sample Donor Account');
      console.log('   📧 Email: donor@example.com');
      console.log('   🔑 Password: donor123\n');
    } else {
      console.log('ℹ️  Sample donor account already exists\n');
    }

    console.log('🎉 User seeding completed!');
    console.log('\n📝 Quick Login Credentials:');
    console.log('┌─────────────┬────────────────────────────────┬──────────────┐');
    console.log('│ Role        │ Email                          │ Password     │');
    console.log('├─────────────┼────────────────────────────────┼──────────────┤');
    console.log('│ Admin       │ admin@donateconnect.local      │ admin123     │');
    console.log('│ Donor       │ donor@example.com              │ donor123     │');
    console.log('│ NGO         │ contact@smilefoundation.org    │ ngo123456    │');
    console.log('└─────────────┴────────────────────────────────┴──────────────┘\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
