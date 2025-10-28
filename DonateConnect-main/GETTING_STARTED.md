# 🎯 DonateConnect - Complete Setup Guide

## 🚀 Quick Start

### Database is Ready! ✅

Your MongoDB database has been populated with:
- **10 Verified NGOs** across Delhi, Mumbai, and Bangalore
- **Admin Account** for platform management
- **Sample Donor Account** for testing

## 📝 Login Credentials

### Admin Dashboard
- **Email:** `admin@donateconnect.local`
- **Password:** `admin123`
- **Access:** Verify NGOs, manage users, view all donations

### Sample Donor Account
- **Email:** `donor@example.com`
- **Password:** `donor123`
- **Access:** Browse NGOs, make donations, track donations

### Sample NGO Accounts (Password: `ngo123456` for all)
1. **Smile Foundation** - `contact@smilefoundation.org`
2. **CRY - Child Rights and You** - `info@cry.org`
3. **Akshaya Patra Foundation** - `contact@akshayapatra.org`
4. **Goonj** - `info@goonj.org`
5. **Teach For India** - `hello@teachforindia.org`
6. **Pratham** - `info@pratham.org`
7. **Helpage India** - `contact@helpageindia.org`
8. **Give India** - `info@giveindia.org`
9. **Magic Bus** - `contact@magicbus.org`
10. **Nanhi Kali** - `info@nanhikali.org`

## 🌟 Features You Can Test Now

### 1. Find NGOs Near Me 📍
- Click "Find NGOs" in the navbar
- Allow location access
- See verified NGOs sorted by distance
- View NGO details, stats, and contact info
- Click "Donate Now" to support them

### 2. Create Your Own Account 👤
- Click "Register" in the navbar
- Choose "Donor" or "NGO" role
- Fill in your details
- Start exploring!

### 3. Browse Home Page 🏠
- Interactive particle animations
- Platform statistics
- Customer reviews
- Submit your own review
- Learn how it works

### 4. Role-Based Dashboards 📊
- **Donors:** View donation history, find NGOs, make donations
- **NGOs:** Manage profile, view received donations, update details
- **Admin:** Verify NGOs, manage users, platform overview

## 🎨 UI Features

### Modern Design Elements
- ✨ Particle.js animated backgrounds
- 🎭 Glassmorphism cards with backdrop blur
- 🌈 Gradient color schemes
- 💫 Hover particle burst effects (5 particles in theme colors)
- 🎯 Parallax scrolling
- 📱 Fully responsive design
- 🎨 Smooth animations and transitions

### Color Themes by Page
- **Home:** Purple/Pink gradient (`#667eea`, `#764ba2`, `#f093fb`)
- **Login:** Purple/Pink gradient
- **Signup:** Green/Teal gradient (`#11998e`, `#38ef7d`)
- **Find NGOs:** Purple/Pink gradient

## 🛠️ Technical Stack

### Backend
- Node.js + Express.js + TypeScript
- MongoDB with geospatial indexing
- JWT authentication
- Bcrypt password hashing
- Multer for file uploads
- Razorpay payment integration (test mode)

### Frontend
- Angular 18 (Standalone Components)
- RxJS for reactive programming
- Particles.js for animations
- CSS3 animations
- Angular Router with guards
- HTTP Interceptors

## 📍 Sample NGO Locations

Our verified NGOs are spread across major cities:

**Delhi** (4 NGOs)
- Smile Foundation - Connaught Place
- Goonj - South Delhi
- Helpage India - Lodhi Road

**Mumbai** (5 NGOs)
- CRY - Bandra West
- Teach For India - Lower Parel
- Pratham - Wadala
- Magic Bus - Andheri East
- Nanhi Kali - Worli

**Bangalore** (2 NGOs)
- Akshaya Patra Foundation - Koramangala
- Give India - Indiranagar

## 🔧 Development Commands

### Backend
```bash
cd server
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
```

### Frontend
```bash
cd client
npm start           # Start dev server (port 4200)
npm run build       # Build for production
```

### Database Scripts
```bash
cd server
npm run seed:users  # Create admin & sample donor
npm run seed:ngos   # Populate 10 verified NGOs
npm run setup:indexes # Create geospatial indexes
```

## 🌐 Access URLs

- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:4000
- **API Health Check:** http://localhost:4000/health

## 🎯 Testing Workflow

1. **Create a Donor Account**
   - Go to http://localhost:4200
   - Click "Register"
   - Fill in details, select "Donor"
   - Submit and auto-login

2. **Find Nearby NGOs**
   - Click "Find NGOs" in navbar
   - Click "Find NGOs Near Me"
   - Allow browser location access
   - Browse verified organizations

3. **Make a Donation**
   - Click "Donate Now" on any NGO card
   - Fill in donation details
   - Complete payment process

4. **Login as NGO**
   - Logout from donor account
   - Login with any NGO credentials
   - View received donations
   - Update profile information

5. **Admin Management**
   - Login as admin
   - View all users and NGOs
   - Verify new NGO registrations
   - Monitor platform activity

## 🚨 Troubleshooting

### Backend not starting?
- Check if MongoDB is running: `mongod --version`
- Start MongoDB: `mongod --dbpath D:\mongodb\data`
- Check `.env` file exists in `server/` folder

### Frontend not loading?
- Clear browser cache
- Check console for errors
- Restart dev server: `npm start`

### "Find NGOs Near Me" not working?
- Allow location access in browser
- Check backend is running on port 4000
- Verify geospatial indexes: `npm run setup:indexes`

### No NGOs showing up?
- Run seed script: `npm run seed:ngos`
- Check MongoDB connection
- Verify backend logs for errors

## 📦 Environment Variables

Backend `.env` file:
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/donateconnect
JWT_SECRET=your_secret_key_here
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
UPLOAD_DIR=uploads
```

## 🎉 You're All Set!

Everything is configured and ready to use. Start by:
1. Opening http://localhost:4200
2. Exploring the beautiful homepage
3. Creating your account or using test accounts
4. Finding NGOs near you
5. Making your first donation!

---

**Built with ❤️ for social good**
