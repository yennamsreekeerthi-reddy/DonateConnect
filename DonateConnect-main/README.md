# DonateConnect (MEAN)

DonateConnect is an NGO donation platform built with the MEAN stack (MongoDB, Express.js, Angular, Node.js). It connects donors and NGOs, enabling item and monetary donations with verification, home pickup, payment, and dashboards.

## Features
- JWT auth with roles: Donor, NGO, Admin
- NGO registration with document upload; admin verification and badge
- Donations: books, clothes, food, money, others; pickup scheduling and status pipeline
- Payments (test mode): Razorpay Checkout with UPI, card, netbanking; store transaction metadata
- Nearby NGOs via geolocation search
- Role-based dashboards (Donor, NGO, Admin)

## Quickstart (Windows PowerShell)

Prereqs:
- Node.js LTS
- Angular CLI (globally)
- Docker Desktop (for MongoDB) or local MongoDB

### 1) Start MongoDB with Docker (Optional - if Docker is installed)
```powershell
docker compose up -d
```

**Alternative:** If Docker is not installed, ensure MongoDB is running locally on port 27017

### 2) Backend setup
```powershell
cd .\server ; npm install ; npm run dev
```

Backend runs on http://localhost:4000

### 3) Frontend setup
```powershell
cd ..\client ; npm install ; npm start
```

Frontend runs on http://localhost:4200

### Environment variables
Copy `.env.example` to `.env` in `server/` and fill values.

### Seed admin
```powershell
cd .\server ; npm run seed:admin
```

## Notes
- Payments are configured in test mode by default.
- Uploaded NGO docs are stored in `server/uploads/` in dev.