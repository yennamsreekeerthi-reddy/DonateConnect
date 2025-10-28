import mongoose from 'mongoose';
import User from '../models/User';
import NGOProfile from '../models/NGOProfile';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/donateconnect';

// Indian cities with coordinates
const indianCities = [
  { city: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { city: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { city: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { city: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { city: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  { city: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  { city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { city: 'Chandigarh', state: 'Chandigarh', lat: 30.7333, lng: 76.7794 },
  { city: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673 },
  { city: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
  { city: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
  { city: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
];

// NGO name templates
const ngoTypes = {
  Education: [
    'Education For All', 'Learning Foundation', 'Literacy Mission', 'Knowledge Hub',
    'Bright Future Trust', 'Scholar Support', 'School Development', 'Study Circle',
    'Children Education', 'Rural Education', 'Digital Learning', 'Skill Development'
  ],
  Health: [
    'Health Care Initiative', 'Medical Relief', 'Wellness Foundation', 'Community Health',
    'Health First', 'Medical Outreach', 'Healthcare Access', 'Health Support',
    'Medical Aid Trust', 'Public Health', 'Primary Care', 'Health Awareness'
  ],
  Environment: [
    'Green Earth', 'Eco Warriors', 'Nature Conservation', 'Environmental Trust',
    'Clean India', 'Tree Plantation', 'Sustainability Initiative', 'Green Future',
    'Climate Action', 'Wildlife Protection', 'Green Cover', 'Earth Guardians'
  ],
  'Women Empowerment': [
    'Women Welfare', 'Empowerment Foundation', 'Women Rights', 'Mahila Shakti',
    'Women Development', 'Girl Child Education', 'Women Support', 'Self Help Group'
  ],
  'Child Welfare': [
    'Child Rights', 'Kids Care', 'Childhood Development', 'Child Protection',
    'Children First', 'Happy Childhood', 'Child Support', 'Young Minds'
  ],
  'Animal Welfare': [
    'Animal Rescue', 'Paws Foundation', 'Wildlife Trust', 'Animal Care',
    'Pet Welfare', 'Stray Animals', 'Animal Rights', 'Creatures Care'
  ]
};

const focusAreasList = ['Education', 'Health', 'Environment', 'Women Empowerment', 'Child Welfare', 'Animal Welfare'];

function generateNGOs(count: number) {
  const ngos = [];
  
  for (let i = 1; i <= count; i++) {
    // Pick random focus areas (1-3 areas)
    const numFocusAreas = Math.floor(Math.random() * 3) + 1;
    const shuffled = [...focusAreasList].sort(() => 0.5 - Math.random());
    const focusAreas = shuffled.slice(0, numFocusAreas);
    const primaryFocus = focusAreas[0];
    
    // Pick random name from primary focus area
    const nameTemplates = ngoTypes[primaryFocus as keyof typeof ngoTypes];
    const nameTemplate = nameTemplates[Math.floor(Math.random() * nameTemplates.length)];
    const organizationName = `${nameTemplate} ${i <= 10 ? 'Foundation' : i <= 20 ? 'Trust' : i <= 30 ? 'Society' : i <= 40 ? 'Organization' : 'Mission'}`;
    
    // Pick random city
    const cityData = indianCities[Math.floor(Math.random() * indianCities.length)];
    
    // Generate pin code
    const pincode = `${Math.floor(100000 + Math.random() * 900000)}`;
    
    ngos.push({
      name: organizationName,
      email: `ngo${i}@example.com`,
      password: 'password123',
      role: 'NGO',
      organizationName: organizationName,
      registrationNumber: `REG/${primaryFocus.substring(0, 3).toUpperCase()}/${2015 + (i % 10)}/${String(i).padStart(3, '0')}`,
      yearEstablished: String(2015 + (i % 10)),
      website: `https://${organizationName.toLowerCase().replace(/ /g, '')}.org`,
      contactPhone: `+91-${9000000000 + i}`,
      address: `${i % 10 + 1} Main Road, ${cityData.city}`,
      city: cityData.city,
      state: cityData.state,
      pincode: pincode,
      focusAreas: focusAreas,
      description: `Working towards ${focusAreas.join(', ').toLowerCase()} development in ${cityData.city} and surrounding areas. Established in ${2015 + (i % 10)}, we have impacted thousands of lives.`,
      location: { type: 'Point', coordinates: [cityData.lng, cityData.lat] },
      verified: true,
      verificationStatus: 'APPROVED'
    });
  }
  
  return ngos;
}

const sampleNGOs = generateNGOs(50);

async function seedNGOs() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Clearing existing NGO data...');
    // Remove existing sample NGOs
    const existingEmails = sampleNGOs.map(ngo => ngo.email);
    await User.deleteMany({ email: { $in: existingEmails } });
    await NGOProfile.deleteMany({ }); // Clear all NGO profiles for fresh start
    
    console.log('Creating NGO users and profiles...');
    
    for (const ngoData of sampleNGOs) {
      // Create user account
      const hashedPassword = await bcrypt.hash(ngoData.password, 10);
      const user = await User.create({
        name: ngoData.name,
        email: ngoData.email,
        passwordHash: hashedPassword,
        role: ngoData.role
      });

      // Create NGO profile
      await NGOProfile.create({
        user: user._id,
        organizationName: ngoData.organizationName,
        registrationNumber: ngoData.registrationNumber,
        yearEstablished: ngoData.yearEstablished,
        website: ngoData.website,
        contactPhone: ngoData.contactPhone,
        address: ngoData.address,
        city: ngoData.city,
        state: ngoData.state,
        pincode: ngoData.pincode,
        focusAreas: ngoData.focusAreas,
        description: ngoData.description,
        location: ngoData.location,
        verified: ngoData.verified,
        verificationStatus: ngoData.verificationStatus,
        documents: []
      });

      console.log(`✓ Created NGO: ${ngoData.organizationName}`);
    }

    console.log('\n✅ Successfully seeded', sampleNGOs.length, 'NGOs!');
    console.log('\nNGO Credentials (email: password):');
    sampleNGOs.forEach(ngo => {
      console.log(`- ${ngo.email}: ${ngo.password}`);
    });

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding NGOs:', error);
    process.exit(1);
  }
}

seedNGOs();
