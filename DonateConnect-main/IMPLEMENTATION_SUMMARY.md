# DonateConnect - Implementation Summary

## ✅ Completed Features

### Backend (Node.js + Express + MongoDB)

#### 1. **Authentication & Authorization**
- JWT-based authentication with bcrypt password hashing
- Role-based access control: `DONOR`, `NGO`, `ADMIN`
- Auth middleware for protected routes
- Signup and Login endpoints

#### 2. **User & NGO Management**
- User model with roles
- NGO Profile model with document upload support (multer)
- Verification flag for NGOs
- Admin endpoints to approve/reject NGO registrations

#### 3. **Donation Management**
- Donation types: Books, Clothes, Food, Money, Others
- Status pipeline: Pending → Accepted → Picked Up → Delivered
- Pickup scheduling with address, date, contact info
- Donor dashboard API (my donations)
- NGO dashboard API (pending donations, accept, update status)

#### 4. **Geospatial Search**
- MongoDB 2dsphere index for NGO locations
- Nearby NGOs API with radius-based search
- Returns verified NGOs within specified distance

#### 5. **Payment Integration**
- Razorpay integration (test mode)
- Payment model stores: method (UPI/Card/NetBanking), amount, status
- Create order and verify payment endpoints
- Transaction metadata persistence

#### 6. **Admin Panel**
- List pending NGO verifications
- Approve/reject NGO registrations
- Admin seed script (admin@donateconnect.local / admin123)

### Frontend (Angular 18)

#### 1. **Core Services**
- `AuthService`: signup, login, logout, JWT token management
- HTTP interceptor for automatic JWT token injection
- Auth guard for route protection

#### 2. **Routing & Navigation**
- Lazy-loaded route components
- Role-based redirection after login
- Routes: `/login`, `/signup`, `/donor`, `/ngo`, `/admin`, `/nearby`

#### 3. **Pages & Components**
- **Login Page**: email/password authentication
- **Signup Page**: choose role (Donor/NGO)
- **Donor Dashboard**: view donation history, logout
- **NGO Dashboard**: view pending donations, accept donations, update status
- **Admin Dashboard**: approve/reject NGO verifications
- **Nearby NGOs**: HTML5 geolocation + backend geo search

#### 4. **UI/UX**
- Clean, modern design with card-based layouts
- Responsive forms with validation
- Error handling and user feedback

## 📋 Project Structure

```
donateconnect/
├── server/                      # Backend (Node.js + Express)
│   ├── src/
│   │   ├── index.ts            # Express app entry point
│   │   ├── models/             # Mongoose models
│   │   │   ├── User.ts
│   │   │   ├── NGOProfile.ts
│   │   │   ├── Donation.ts
│   │   │   └── Payment.ts
│   │   ├── routes/             # API routes
│   │   │   ├── auth.ts         # Signup/Login
│   │   │   ├── ngo.ts          # NGO profile, nearby search
│   │   │   ├── donation.ts     # Donation CRUD
│   │   │   ├── payment.ts      # Razorpay integration
│   │   │   └── admin.ts        # NGO verification
│   │   ├── middleware/
│   │   │   └── auth.ts         # JWT auth + role checks
│   │   └── scripts/
│   │       └── seedAdmin.ts    # Seed admin user
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── client/                      # Frontend (Angular 18)
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/           # Services, guards, interceptors
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── auth.interceptor.ts
│   │   │   ├── pages/          # Feature pages
│   │   │   │   ├── login/
│   │   │   │   ├── signup/
│   │   │   │   ├── donor-dashboard/
│   │   │   │   ├── ngo-dashboard/
│   │   │   │   ├── admin-dashboard/
│   │   │   │   └── nearby-ngos/
│   │   │   ├── app.component.ts
│   │   │   └── app.routes.ts
│   │   ├── main.ts
│   │   ├── index.html
│   │   └── styles.css
│   ├── package.json
│   ├── angular.json
│   └── tsconfig.json
│
├── docker-compose.yml           # MongoDB container
└── README.md                    # Setup instructions
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ LTS
- MongoDB (local or Docker)
- Angular CLI (installed via npm)

### Setup Steps

#### 1. Start MongoDB
```powershell
docker compose up -d
```
*(Or use local MongoDB on port 27017)*

#### 2. Backend Setup
```powershell
cd server
npm install
npm run dev
```
Backend runs on **http://localhost:4000**

#### 3. Seed Admin User
```powershell
cd server
npm run seed:admin
```
Admin credentials: `admin@donateconnect.local` / `admin123`

#### 4. Frontend Setup
```powershell
cd client
npm install
npm start
```
Frontend runs on **http://localhost:4200**

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login

### NGOs
- `POST /api/ngos` - Create/update NGO profile (NGO role, with file upload)
- `GET /api/ngos/me` - Get own NGO profile
- `GET /api/ngos/nearby?lat=X&lng=Y&radiusKm=10` - Find nearby verified NGOs

### Donations
- `POST /api/donations` - Create donation (Donor)
- `GET /api/donations/mine` - My donations (Donor)
- `GET /api/donations/pending` - Pending donations (NGO)
- `POST /api/donations/:id/accept` - Accept donation (NGO)
- `POST /api/donations/:id/status` - Update status (NGO)

### Payments
- `POST /api/payments/create-order` - Create Razorpay order (Donor)
- `POST /api/payments/confirm` - Verify payment (Donor)

### Admin
- `GET /api/admin/ngos/pending` - Pending NGO verifications (Admin)
- `POST /api/admin/ngos/:id/verify` - Approve NGO (Admin)
- `POST /api/admin/ngos/:id/reject` - Reject NGO (Admin)

## 🧪 Testing the Platform

### 1. Create Admin (already seeded)
- Email: `admin@donateconnect.local`
- Password: `admin123`

### 2. Register as NGO
- Signup with role "NGO"
- Upload verification documents
- Login as Admin → Verify the NGO

### 3. Register as Donor
- Signup with role "Donor"
- Create donations
- Find nearby NGOs
- Make payments

### 4. NGO Workflow
- Login as NGO
- View pending donations
- Accept donations
- Update pickup/delivery status

## 🎯 Features Implemented

✅ JWT Authentication with roles  
✅ NGO registration with document upload  
✅ Admin verification dashboard  
✅ Donation management (CRUD, status pipeline)  
✅ Home pickup scheduling  
✅ Payment integration (Razorpay test mode)  
✅ Geospatial search for nearby NGOs  
✅ Role-based dashboards (Donor, NGO, Admin)  
✅ Responsive UI with Angular standalone components  

## 📝 Environment Variables

Create `server/.env` from `server/.env.example`:
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/donateconnect
JWT_SECRET=your_secret_key_here
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
UPLOAD_DIR=uploads
```

## 🔒 Security Notes

- Passwords are hashed with bcrypt (10 rounds)
- JWT tokens expire in 7 days
- Role-based middleware protects endpoints
- File uploads are validated by multer
- CORS enabled for frontend communication
- Razorpay keys should be test mode for development

## 🚧 Future Enhancements

- Unit/integration tests (Jest, Jasmine)
- Email notifications
- SMS alerts for pickups
- Real-time chat between donor/NGO
- Advanced admin analytics
- Mobile app (Ionic/React Native)
- Payment gateway webhooks for reliability
- Image compression for uploaded documents

## 📦 Tech Stack

**Backend:**
- Node.js + Express.js
- TypeScript
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Bcrypt
- Multer (file uploads)
- Razorpay SDK

**Frontend:**
- Angular 18 (standalone components)
- TypeScript
- RxJS
- Angular Router
- FormsModule
- HttpClient

**DevOps:**
- Docker Compose (MongoDB)
- ts-node-dev (hot reload)
- Angular CLI (dev server)

---

**Built with ❤️ for connecting donors and NGOs to make a difference!**
