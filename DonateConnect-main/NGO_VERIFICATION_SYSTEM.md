# NGO Verification System - DonateConnect

## Overview
A comprehensive multi-step NGO registration and verification system with document upload, admin approval, and enhanced security features.

---

## Features Implemented

### 1. **Role Selection Interface**
- Modern glassmorphism UI with gradient background
- Visual cards for Donor vs NGO selection
- Feature highlights for each role
- Smooth animations and transitions

### 2. **Donor Signup (Simple)**
- Single-step registration form
- Fields: Name, Email, Password
- Terms & conditions checkbox
- Instant account creation

### 3. **NGO Signup (Multi-Step Process)**

#### **Step 1: Account Details**
- Contact person name
- Official email address
- Secure password (min 6 characters)
- Primary contact phone number

#### **Step 2: Organization Details**
- Organization name (registered name)
- Government registration number
- Year established (1900 - current year)
- Website (optional)
- Detailed organization description

#### **Step 3: Verification Details**
- Complete address
- City, State, Pincode
- **Focus Areas** (multi-select):
  - Education
  - Healthcare
  - Environment
  - Animal Welfare
  - Women Empowerment
  - Child Welfare
  - Elderly Care
  - Disaster Relief
  - Poverty Alleviation
  - Skill Development
  - Rural Development
  - Other

#### **Step 4: Document Upload**
Required documents for verification:
- **Registration Certificate** (mandatory)
- **12A Certificate** (tax exemption)
- **80G Certificate** (donation tax benefits)
- **PAN Card** (organization PAN)

**Document Requirements:**
- File formats: PDF, JPG, PNG
- Maximum size: 5MB per file
- Minimum: 1 document required
- Maximum: 4 documents supported

### 4. **Visual Progress Indicator**
- 4-step progress bar with animated states
- Active step highlighting
- Completed step checkmarks
- Clear visual feedback

### 5. **Form Validation**
- Real-time field validation
- Step-by-step validation before proceeding
- Required field checks
- Password strength validation
- File size validation (5MB limit)
- Focus area selection validation (at least one)

---

## Backend Implementation

### Database Schema Updates

**NGOProfile Model** (`server/src/models/NGOProfile.ts`)

```typescript
interface INGOProfile {
  user: ObjectId;
  organizationName: string;
  registrationNumber?: string;
  yearEstablished?: string;
  website?: string;
  contactPhone: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  focusAreas?: string[];
  description?: string;
  documents: string[];
  verified: boolean;
  verificationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  verificationNotes?: string;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
}
```

### API Endpoints

#### **NGO Profile Creation**
```http
POST /api/ngo/profile
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- organizationName (string)
- registrationNumber (string)
- yearEstablished (string)
- website (string)
- contactPhone (string)
- address (string)
- city (string)
- state (string)
- pincode (string)
- focusAreas (JSON array)
- description (string)
- documents[] (files)
```

**Response:**
```json
{
  "message": "NGO profile created successfully. Awaiting admin verification.",
  "profile": {
    "_id": "...",
    "organizationName": "Save The Children India",
    "verificationStatus": "PENDING",
    "verified": false,
    ...
  }
}
```

#### **Admin Verification Endpoints**

**Get Pending Verifications**
```http
GET /api/admin/ngos/pending
Authorization: Bearer <admin-token>
```

**Get Verified NGOs**
```http
GET /api/admin/ngos/verified
Authorization: Bearer <admin-token>
```

**Get Rejected NGOs**
```http
GET /api/admin/ngos/rejected
Authorization: Bearer <admin-token>
```

**Get NGO Details**
```http
GET /api/admin/ngos/:id
Authorization: Bearer <admin-token>
```

**Approve Verification**
```http
POST /api/admin/ngos/:id/verify
Authorization: Bearer <admin-token>
Content-Type: application/json

Body:
{
  "notes": "All documents verified successfully"
}
```

**Response:**
```json
{
  "message": "NGO verified successfully",
  "profile": {
    "_id": "...",
    "verified": true,
    "verificationStatus": "APPROVED",
    "verificationNotes": "All documents verified successfully"
  }
}
```

**Reject Verification**
```http
POST /api/admin/ngos/:id/reject
Authorization: Bearer <admin-token>
Content-Type: application/json

Body:
{
  "reason": "Invalid registration certificate"
}
```

**Response:**
```json
{
  "message": "NGO verification rejected",
  "profile": {
    "_id": "...",
    "verified": false,
    "verificationStatus": "REJECTED",
    "verificationNotes": "Invalid registration certificate"
  }
}
```

---

## User Flow

### NGO Registration Flow

1. **Visit Signup Page**
   - User sees role selection screen
   - Chooses "I'm an NGO"

2. **Step 1: Account Details**
   - Enter contact person name
   - Enter official email
   - Create password
   - Enter contact phone
   - Click "Continue"

3. **Step 2: Organization Details**
   - Enter organization name
   - Enter registration number
   - Select year established
   - Enter website (optional)
   - Write organization description
   - Click "Continue"

4. **Step 3: Verification Details**
   - Enter complete address
   - Enter city, state, pincode
   - Select focus areas (multiple)
   - Click "Continue"

5. **Step 4: Document Upload**
   - Upload Registration Certificate
   - Upload 12A Certificate
   - Upload 80G Certificate
   - Upload PAN Card
   - Accept terms & conditions
   - Click "Submit Registration"

6. **Post-Submission**
   - User account created (role: NGO)
   - NGO profile created with status: PENDING
   - User redirected to NGO dashboard
   - Dashboard shows verification pending message

### Admin Verification Flow

1. **Admin Login**
   - Login as admin user

2. **View Pending Verifications**
   - Navigate to admin panel
   - View list of pending NGO verifications

3. **Review NGO Details**
   - Click on NGO to view full details
   - Review all submitted information
   - Download and verify documents

4. **Make Decision**
   - **Approve**: Click "Approve" with verification notes
   - **Reject**: Click "Reject" with reason
   - NGO verification status updated

5. **NGO Notification**
   - NGO sees verification status in dashboard
   - If approved: Full access to donation features
   - If rejected: Can see rejection reason and resubmit

---

## Security Features

1. **Authentication**
   - JWT token-based authentication
   - Role-based access control (DONOR, NGO, ADMIN)
   - Protected routes for NGO and Admin

2. **File Upload Security**
   - File type validation (PDF, images only)
   - File size limits (5MB per file)
   - Unique filename generation (timestamp-based)
   - Secure storage in server uploads directory

3. **Data Validation**
   - Required field validation
   - Email format validation
   - Phone number format validation
   - Pincode pattern validation (6 digits)
   - Year range validation

4. **Admin Controls**
   - Only ADMIN role can verify/reject NGOs
   - Verification notes/reasons logged
   - Audit trail with timestamps

---

## UI/UX Highlights

### Design Elements
- **Glassmorphism**: Frosted glass effect with blur
- **Gradient Backgrounds**: Vibrant purple-blue gradients
- **Particle Effects**: Animated particles.js background
- **Smooth Animations**: Fade-in, slide-in transitions
- **Progress Indicator**: Clear 4-step visual progress
- **Responsive Design**: Mobile-friendly layout

### Color Scheme
- Primary: #667eea (Blue-purple)
- Secondary: #764ba2 (Purple)
- Accent: #f093fb (Pink)
- Success: #10b981 (Green)
- Error: #ef4444 (Red)
- Background: White with transparency

### Typography
- Headings: Bold 700-800 weight
- Body: Regular 400 weight
- Links: Underlined with hover effects

---

## Testing Instructions

### Test NGO Signup

1. **Start the Application**
   ```bash
   # Terminal 1: Backend
   cd server
   npm run dev
   
   # Terminal 2: Frontend
   cd client
   npm start
   ```

2. **Navigate to Signup**
   - Open http://localhost:4200/signup
   - Click "Register as NGO"

3. **Fill Step 1**
   - Name: "John Doe"
   - Email: "contact@savechildren.org"
   - Password: "secure123"
   - Phone: "+91 98765 43210"
   - Click "Continue"

4. **Fill Step 2**
   - Organization: "Save The Children India"
   - Registration: "REG/2010/12345"
   - Year: "2010"
   - Website: "https://savechildren.org"
   - Description: "Working for child welfare and education..."
   - Click "Continue"

5. **Fill Step 3**
   - Address: "123 Main Street, Gandhi Nagar"
   - City: "New Delhi"
   - State: "Delhi"
   - Pincode: "110001"
   - Focus Areas: Select "Child Welfare", "Education"
   - Click "Continue"

6. **Upload Documents (Step 4)**
   - Upload at least 1 document
   - Check terms & conditions
   - Click "Submit Registration"

7. **Verify Success**
   - See success message
   - Redirected to NGO dashboard
   - Profile shows "Verification Pending"

### Test Admin Verification

1. **Login as Admin**
   - Email: admin@example.com
   - Password: admin123

2. **View Pending NGOs**
   - Navigate to admin panel
   - See list of pending verifications

3. **Review NGO**
   - Click on submitted NGO
   - View all details and documents

4. **Approve NGO**
   ```bash
   POST http://localhost:4000/api/admin/ngos/:id/verify
   Headers: { Authorization: Bearer <admin-token> }
   Body: { "notes": "All documents verified" }
   ```

5. **Check NGO Status**
   - Login as NGO
   - See "Verified" badge
   - Full access to features

---

## Files Modified

### Frontend
1. **`client/src/app/pages/signup/signup.component.ts`** (COMPLETELY REDESIGNED)
   - Multi-step form implementation
   - Role selection interface
   - Document upload handling
   - Step validation logic
   - Progress indicator

### Backend
1. **`server/src/models/NGOProfile.ts`** (ENHANCED)
   - Added registration details fields
   - Added verification status enum
   - Added focus areas array
   - Added location fields

2. **`server/src/routes/ngo.ts`** (ENHANCED)
   - New `/profile` endpoint for detailed registration
   - Document upload handling (up to 10 files)
   - Focus areas parsing
   - Address formatting

3. **`server/src/routes/admin.ts`** (ENHANCED)
   - Pending/verified/rejected NGO lists
   - NGO detail endpoint
   - Approve/reject with notes/reasons
   - Enhanced response messages

### Infrastructure
1. **`server/uploads/`** (NEW DIRECTORY)
   - Created for document storage

---

## Next Steps / Future Enhancements

### Immediate
- [ ] Email notifications for verification status
- [ ] NGO dashboard verification status display
- [ ] Document preview in admin panel
- [ ] Resubmission flow for rejected NGOs

### Short-term
- [ ] SMS notifications
- [ ] Document verification checklist
- [ ] Automated document OCR verification
- [ ] NGO profile public page

### Long-term
- [ ] Blockchain-based verification certificates
- [ ] AI-powered fraud detection
- [ ] Video KYC for NGO verification
- [ ] Annual re-verification system
- [ ] Donor reviews and ratings
- [ ] NGO impact reporting dashboard

---

## Troubleshooting

### Issue: Documents not uploading
**Solution**: 
- Check `uploads` directory exists: `server/uploads/`
- Verify file size < 5MB
- Check file format (PDF, JPG, PNG)

### Issue: "Verification pending" forever
**Solution**:
- Admin must manually approve via admin panel
- Check admin endpoints are accessible
- Verify admin authentication token

### Issue: Step navigation not working
**Solution**:
- Check all required fields are filled
- Verify client-side validation
- Check browser console for errors

### Issue: 401 Unauthorized on profile creation
**Solution**:
- User must be logged in
- Check JWT token is stored: `localStorage.getItem('dc_token')`
- Verify token is valid and not expired

---

## API Testing (Postman/Curl)

### Create NGO Profile
```bash
curl -X POST http://localhost:4000/api/ngo/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "organizationName=Save The Children" \
  -F "registrationNumber=REG/2010/12345" \
  -F "yearEstablished=2010" \
  -F "contactPhone=+919876543210" \
  -F "address=123 Main St" \
  -F "city=Delhi" \
  -F "state=Delhi" \
  -F "pincode=110001" \
  -F 'focusAreas=["Education","Child Welfare"]' \
  -F "description=Helping children..." \
  -F "documents=@/path/to/registration.pdf" \
  -F "documents=@/path/to/12a-cert.pdf"
```

### Admin Approve
```bash
curl -X POST http://localhost:4000/api/admin/ngos/NGO_ID/verify \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"notes":"All documents verified successfully"}'
```

---

## Summary

The NGO Verification System provides:
✓ Professional multi-step registration UI
✓ Comprehensive organization verification
✓ Document upload with validation
✓ Admin approval workflow
✓ Enhanced security and validation
✓ Modern glassmorphism design
✓ Responsive mobile-friendly layout
✓ Clear progress indicators
✓ Role-based access control

This system ensures only legitimate NGOs with verified documents can receive donations on the platform, building trust and credibility for the DonateConnect ecosystem.
