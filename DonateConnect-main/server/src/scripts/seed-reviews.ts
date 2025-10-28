import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Review from '../models/Review';

const sampleReviews = [
  {
    name: 'Priya Sharma',
    role: 'Individual Donor',
    rating: 5,
    text: 'DonateConnect has transformed how I give to charity. The transparency and ease of tracking my donations gives me confidence that my contributions are making a real difference. The doorstep pickup service is incredibly convenient!',
    verified: true
  },
  {
    name: 'Rajesh Kumar',
    role: 'Corporate Donor',
    rating: 5,
    text: 'We have been using DonateConnect for our company CSR initiatives. The platform makes it easy to manage multiple donations, and the detailed impact reports help us showcase our social responsibility to stakeholders.',
    verified: true
  },
  {
    name: 'Anjali Mehta',
    role: 'NGO Representative',
    rating: 5,
    text: 'As an NGO, this platform has been a game-changer. The verification process was thorough but fair, and now we receive regular donations from donors who trust our work. The dashboard helps us manage everything efficiently.',
    verified: true
  },
  {
    name: 'Vikram Singh',
    role: 'Individual Donor',
    rating: 5,
    text: 'I love the geolocation feature! I can support NGOs in my neighborhood and see the local impact of my donations. The platform is user-friendly, and customer support is always helpful.',
    verified: true
  },
  {
    name: 'Sneha Patel',
    role: 'Individual Donor',
    rating: 5,
    text: 'The mobile app makes donating on-the-go so easy. I set up monthly recurring donations to my favorite causes, and I get regular updates on how the funds are being used. Highly recommend!',
    verified: true
  },
  {
    name: 'Amit Desai',
    role: 'Volunteer',
    rating: 5,
    text: 'Been volunteering with NGOs listed on DonateConnect for over a year. The platform not only facilitates donations but also creates a community of givers. The impact stories inspire me to do more.',
    verified: true
  }
];

async function seedReviews() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/donateconnect';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing reviews
    await Review.deleteMany({});
    console.log('🗑️  Cleared existing reviews');

    // Insert sample reviews with staggered dates
    const reviews = sampleReviews.map((review, index) => ({
      ...review,
      createdAt: new Date(Date.now() - (index * 5 * 24 * 60 * 60 * 1000)) // Each review 5 days apart
    }));

    await Review.insertMany(reviews);
    console.log(`✅ Seeded ${reviews.length} reviews`);

    // Display seeded reviews
    const allReviews = await Review.find().sort({ createdAt: -1 });
    console.log('\n📝 Seeded Reviews:');
    allReviews.forEach((review, i) => {
      console.log(`\n${i + 1}. ${review.name} (${review.role})`);
      console.log(`   Rating: ${'⭐'.repeat(review.rating)}`);
      console.log(`   Verified: ${review.verified ? '✓' : '✗'}`);
      console.log(`   Date: ${review.createdAt.toLocaleDateString()}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
    process.exit(1);
  }
}

seedReviews();
