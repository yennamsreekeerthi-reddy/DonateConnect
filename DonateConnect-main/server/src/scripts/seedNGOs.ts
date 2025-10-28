import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import NGOProfile from '../models/NGOProfile';

const sampleNGOs = [
  {
    organizationName: 'Smile Foundation',
    email: 'contact@smilefoundation.org',
    password: 'ngo123456',
    registrationNumber: 'REG001',
    address: 'Connaught Place, New Delhi, Delhi 110001',
    contactPhone: '+91-11-41398888',
    location: { type: 'Point', coordinates: [77.2090, 28.6139] }, // Delhi
    website: 'https://smilefoundation.org',
    description: 'Working towards education, healthcare, and livelihood for underprivileged children and families.',
    verified: true
  },
  {
    organizationName: 'CRY - Child Rights and You',
    email: 'info@cry.org',
    password: 'ngo123456',
    registrationNumber: 'REG002',
    address: 'Bandra West, Mumbai, Maharashtra 400050',
    contactPhone: '+91-22-26528989',
    location: { type: 'Point', coordinates: [72.8347, 19.0596] }, // Mumbai
    website: 'https://cry.org',
    description: 'Ensuring happier childhoods for underprivileged children through education, nutrition, and protection.',
    verified: true
  },
  {
    organizationName: 'Akshaya Patra Foundation',
    email: 'contact@akshayapatra.org',
    password: 'ngo123456',
    registrationNumber: 'REG003',
    address: 'Koramangala, Bangalore, Karnataka 560034',
    contactPhone: '+91-80-30143400',
    location: { type: 'Point', coordinates: [77.5946, 12.9716] }, // Bangalore
    website: 'https://akshayapatra.org',
    description: 'Running the worlds largest NGO-run mid-day meal programme serving nutritious meals to children.',
    verified: true
  },
  {
    organizationName: 'Goonj',
    email: 'info@goonj.org',
    password: 'ngo123456',
    registrationNumber: 'REG004',
    address: 'South Delhi, New Delhi, Delhi 110044',
    contactPhone: '+91-11-26972351',
    location: { type: 'Point', coordinates: [77.2167, 28.5355] }, // South Delhi
    website: 'https://goonj.org',
    description: 'Working on disaster relief, humanitarian aid, and community development across India.',
    verified: true
  },
  {
    organizationName: 'Teach For India',
    email: 'hello@teachforindia.org',
    password: 'ngo123456',
    registrationNumber: 'REG005',
    address: 'Lower Parel, Mumbai, Maharashtra 400013',
    contactPhone: '+91-22-62434400',
    location: { type: 'Point', coordinates: [72.8311, 18.9950] }, // Mumbai Lower Parel
    website: 'https://teachforindia.org',
    description: 'Recruiting and developing young leaders to work as full-time teachers in low-income communities.',
    verified: true
  },
  {
    organizationName: 'Pratham',
    email: 'info@pratham.org',
    password: 'ngo123456',
    registrationNumber: 'REG006',
    address: 'Wadala, Mumbai, Maharashtra 400031',
    contactPhone: '+91-22-24143241',
    location: { type: 'Point', coordinates: [72.8656, 19.0176] }, // Mumbai Wadala
    website: 'https://pratham.org',
    description: 'Innovative education programs to ensure every child has access to quality education.',
    verified: true
  },
  {
    organizationName: 'Helpage India',
    email: 'contact@helpageindia.org',
    password: 'ngo123456',
    registrationNumber: 'REG007',
    address: 'Lodhi Road, New Delhi, Delhi 110003',
    contactPhone: '+91-11-41688955',
    location: { type: 'Point', coordinates: [77.2270, 28.5886] }, // Delhi Lodhi Road
    website: 'https://helpageindia.org',
    description: 'Working for the cause and care of disadvantaged elderly in India.',
    verified: true
  },
  {
    organizationName: 'Give India',
    email: 'info@giveindia.org',
    password: 'ngo123456',
    registrationNumber: 'REG008',
    address: 'Indiranagar, Bangalore, Karnataka 560038',
    contactPhone: '+91-80-67683333',
    location: { type: 'Point', coordinates: [77.6408, 12.9716] }, // Bangalore Indiranagar
    website: 'https://giveindia.org',
    description: 'Indias largest and most trusted giving platform connecting donors with verified NGOs.',
    verified: true
  },
  {
    organizationName: 'Magic Bus',
    email: 'contact@magicbus.org',
    password: 'ngo123456',
    registrationNumber: 'REG009',
    address: 'Andheri East, Mumbai, Maharashtra 400069',
    contactPhone: '+91-22-28366555',
    location: { type: 'Point', coordinates: [72.8697, 19.1136] }, // Mumbai Andheri
    website: 'https://magicbus.org',
    description: 'Using sports and play to move children from poverty to opportunity.',
    verified: true
  },
  {
    organizationName: 'Nanhi Kali',
    email: 'info@nanhikali.org',
    password: 'ngo123456',
    registrationNumber: 'REG010',
    address: 'Worli, Mumbai, Maharashtra 400018',
    contactPhone: '+91-22-66657000',
    location: { type: 'Point', coordinates: [72.8181, 19.0144] }, // Mumbai Worli
    website: 'https://nanhikali.org',
    description: 'Supporting underprivileged girls with education to complete their schooling.',
    verified: true
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/donateconnect';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing NGO data...');
    await User.deleteMany({ role: 'NGO' });
    await NGOProfile.deleteMany({});
    console.log('✅ Cleared existing data\n');

    console.log('🌱 Seeding NGO data...\n');

    for (const ngoData of sampleNGOs) {
      // Create user account for NGO
      const passwordHash = await bcrypt.hash(ngoData.password, 10);
      const user = await User.create({
        name: ngoData.organizationName,
        email: ngoData.email,
        passwordHash,
        role: 'NGO'
      });

      // Create NGO profile
      const ngoProfile = await NGOProfile.create({
        user: user._id,
        organizationName: ngoData.organizationName,
        address: ngoData.address,
        contactPhone: ngoData.contactPhone,
        location: ngoData.location,
        verified: ngoData.verified,
        documents: []
      });

      console.log(`✅ Created: ${ngoData.organizationName}`);
      console.log(`   📧 Email: ${ngoData.email}`);
      console.log(`   🔑 Password: ${ngoData.password}`);
      console.log(`   📍 Location: ${ngoData.address}`);
      console.log(`   ✓ Verified: ${ngoData.verified}\n`);
    }

    console.log('\n🎉 Successfully seeded database with NGO data!');
    console.log(`📊 Total NGOs created: ${sampleNGOs.length}`);
    console.log('\n💡 You can now:');
    console.log('   1. Use "Find NGOs Near Me" to discover these organizations');
    console.log('   2. Login as any NGO using their email and password: ngo123456');
    console.log('   3. Make donations to these verified NGOs');
    console.log('\n📝 Sample NGO Login:');
    console.log('   Email: contact@smilefoundation.org');
    console.log('   Password: ngo123456\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
