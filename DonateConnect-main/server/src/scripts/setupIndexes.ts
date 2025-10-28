import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import NGOProfile from '../models/NGOProfile';

const setupIndexes = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/donateconnect';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Create geospatial index for nearby NGO search
    await NGOProfile.collection.createIndex({ location: '2dsphere' });
    console.log('✅ Created 2dsphere index on location field');

    // Create other useful indexes
    await NGOProfile.collection.createIndex({ verified: 1 });
    console.log('✅ Created index on verified field');

    await NGOProfile.collection.createIndex({ userId: 1 });
    console.log('✅ Created index on userId field');

    console.log('\n✨ All indexes created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up indexes:', error);
    process.exit(1);
  }
};

setupIndexes();
