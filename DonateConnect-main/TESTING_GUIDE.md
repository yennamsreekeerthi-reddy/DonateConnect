# Quick Test Commands

## Test the Backend API

### 1. Health Check
```powershell
curl http://localhost:4000/health
```

### 2. Create Donor Account
```powershell
curl -X POST http://localhost:4000/api/auth/signup `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test Donor\",\"email\":\"donor@test.com\",\"password\":\"test123\",\"role\":\"DONOR\"}'
```

### 3. Login as Donor
```powershell
curl -X POST http://localhost:4000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"donor@test.com\",\"password\":\"test123\"}'
```
Save the token from response!

### 4. Login as Admin
```powershell
curl -X POST http://localhost:4000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"admin@donateconnect.local\",\"password\":\"admin123\"}'
```

### 5. Create Donation (use donor token)
```powershell
curl -X POST http://localhost:4000/api/donations `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_DONOR_TOKEN" `
  -d '{\"type\":\"BOOKS\",\"quantity\":10,\"pickupOption\":\"HOME_PICKUP\",\"address\":\"123 Main St\",\"contactPhone\":\"1234567890\"}'
```

### 6. Get Pending NGO Verifications (use admin token)
```powershell
curl http://localhost:4000/api/admin/ngos/pending `
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 7. Find Nearby NGOs (public)
```powershell
curl "http://localhost:4000/api/ngos/nearby?lat=40.7128&lng=-74.0060&radiusKm=10"
```

## Test the Frontend

### 1. Open in Browser
Navigate to: http://localhost:4200

### 2. Test Login
- Email: `admin@donateconnect.local`
- Password: `admin123`
- Should redirect to `/admin` dashboard

### 3. Test Signup
- Click "Signup"
- Fill form with new user details
- Select role (Donor or NGO)
- Should redirect to role dashboard

### 4. Test Nearby NGOs
- Navigate to http://localhost:4200/nearby
- Click "Find NGOs Near Me"
- Allow location permission
- Should show nearby verified NGOs

## MongoDB Queries (if using MongoDB Compass)

Connect to: `mongodb://localhost:27017/donateconnect`

### View all users
```javascript
db.users.find()
```

### View all donations
```javascript
db.donations.find().sort({ createdAt: -1 })
```

### View verified NGOs
```javascript
db.ngoprofiles.find({ verified: true })
```

### View pending payments
```javascript
db.payments.find({ status: 'CREATED' })
```

## Seed Additional Data

### Create NGO User
```powershell
curl -X POST http://localhost:4000/api/auth/signup `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test NGO\",\"email\":\"ngo@test.com\",\"password\":\"test123\",\"role\":\"NGO\"}'
```

### Create Multiple Donors
```powershell
# Donor 1
curl -X POST http://localhost:4000/api/auth/signup `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Alice Donor\",\"email\":\"alice@test.com\",\"password\":\"test123\",\"role\":\"DONOR\"}'

# Donor 2
curl -X POST http://localhost:4000/api/auth/signup `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Bob Donor\",\"email\":\"bob@test.com\",\"password\":\"test123\",\"role\":\"DONOR\"}'
```

## Reset Database (if needed)

### Drop all collections (use with caution!)
```javascript
// In MongoDB shell or Compass
db.users.deleteMany({})
db.ngoprofiles.deleteMany({})
db.donations.deleteMany({})
db.payments.deleteMany({})
```

Then re-run seed script:
```powershell
cd server ; npm run seed:admin
```

## Check Logs

### Backend Logs
Check terminal running `npm run dev` in server directory

### Frontend Logs
Check browser console (F12) when using the Angular app

### MongoDB Logs
If using Docker:
```powershell
docker compose logs -f mongo
```

## Stop Services

### Stop Backend
Press `Ctrl+C` in server terminal

### Stop Frontend
Press `Ctrl+C` in client terminal

### Stop MongoDB (Docker)
```powershell
docker compose down
```

## Troubleshooting

### Port Already in Use
```powershell
# Find process using port 4000
netstat -ano | findstr :4000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### MongoDB Connection Issues
1. Check if MongoDB is running
2. Verify `MONGO_URI` in `.env`
3. Check Docker status: `docker ps`

### Frontend Not Loading
1. Check if Angular dev server is running
2. Clear browser cache
3. Check console for errors (F12)

### Authentication Issues
1. Check if token is expired (7 days)
2. Verify JWT_SECRET in `.env`
3. Clear localStorage in browser

---

**Quick Start Checklist:**
- [ ] MongoDB running
- [ ] Backend running on :4000
- [ ] Frontend running on :4200
- [ ] Admin user seeded
- [ ] .env file configured
- [ ] Browser open to http://localhost:4200
