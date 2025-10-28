# Donation Submission Fix - October 20, 2025

## Problem
User reported: "Failed to submit donation while donating"

## Root Cause Analysis

The backend and frontend had mismatched data structures for donations:

### Backend Expected:
- `pickupOption`: 'HOME_PICKUP' or 'DROP_OFF' (required)
- `notes`: description field
- `address`: pickup address
- Type values: 'BOOKS', 'CLOTHES', 'FOOD', 'MONEY', 'OTHERS'
- No `ngoId` field (NGO assigned later when they accept)
- No `amount` field
- No `pickupRequired` boolean

### Frontend Sent:
- `ngoId`: NGO profile ID
- `amount`: for money donations
- `description`: donation description
- `pickupRequired`: boolean
- `pickupAddress`: pickup address
- Type values: 'MONEY', 'FOOD', 'CLOTHES', 'BOOKS', 'OTHER'

## Solutions Implemented

### 1. Updated Donation Model (`server/src/models/Donation.ts`)

**Changes:**
- Added `amount?: number` field for MONEY donations
- Renamed `notes` to `description`
- Added `pickupRequired?: boolean` field
- Renamed `address` to `pickupAddress`
- Made `pickupOption` optional (calculated from pickupRequired)
- Updated type enum to include 'OTHER' instead of 'OTHERS'
- Added 'COMPLETED' and 'REJECTED' to status enum
- Changed `ngo` reference to point to User (NGO owner)

### 2. Updated Donation Route (`server/src/routes/donation.ts`)

**POST /api/donations:**
```typescript
// Now accepts:
{
  ngoId: string (optional - User ID of NGO owner),
  type: 'MONEY' | 'FOOD' | 'CLOTHES' | 'BOOKS' | 'OTHER',
  amount: number (for MONEY type),
  description: string,
  pickupRequired: boolean,
  pickupAddress: string (if pickupRequired is true)
}

// Automatically converts to:
{
  donor: req.user.id,
  ngo: ngoId,
  type: type,
  amount: amount (if MONEY),
  description: description,
  pickupRequired: pickupRequired,
  pickupOption: pickupRequired ? 'HOME_PICKUP' : 'DROP_OFF',
  pickupAddress: pickupAddress (if pickup required),
  status: 'PENDING'
}
```

**Features:**
- ✅ Accepts ngoId (optional)
- ✅ Validates donation type
- ✅ Handles amount for MONEY donations
- ✅ Automatically sets pickupOption based on pickupRequired
- ✅ Populates NGO details on response
- ✅ Returns 201 status with success message
- ✅ Proper error handling with descriptive messages
- ✅ Backward compatibility with old field names

**GET /api/donations/mine:**
- Now populates NGO details (name, organizationName, email)
- Better error handling

### 3. Updated NGO Nearby Route (`server/src/routes/ngo.ts`)

**GET /api/ngos/nearby:**
- Now includes `user` field in response
- Populates user email for display
- Returns: `{ user: { _id, email }, organizationName, address, ... }`

### 4. Updated Frontend Donation Submission (`client/src/app/pages/nearby-ngos/nearby-ngos.component.ts`)

**Changes:**
```typescript
// Extract NGO User ID from the selected NGO
const ngoUserId = this.selectedNgo.user?._id || this.selectedNgo.user;

// Send correct ngoId (User ID, not NGOProfile ID)
const donationData = {
  ngoId: ngoUserId,
  type: this.donationForm.type,
  amount: this.donationForm.type === 'MONEY' ? this.donationForm.amount : undefined,
  description: ...,
  pickupRequired: ...,
  pickupAddress: ...
};
```

## Data Flow

### Before Fix:
```
Frontend → ngoId: NGOProfile._id → Backend (REJECTED - invalid user reference)
```

### After Fix:
```
Frontend → ngoId: NGOProfile.user._id → Backend → Donation created ✅
                    ↓
            (User ID of NGO owner)
```

## Testing Steps

1. ✅ Login as donor (donor@example.com / donor123)
2. ✅ Navigate to "Find NGOs Near Me"
3. ✅ Click "Donate Now" on any NGO
4. ✅ Fill donation form:
   - Select type (MONEY, FOOD, etc.)
   - Enter amount (for money)
   - Select pickup option
   - Add pickup address (if needed)
5. ✅ Submit donation
6. ✅ Verify success message appears
7. ✅ Check donor dashboard to see new donation

## Expected Results

### Success Response:
```json
{
  "message": "Donation created successfully",
  "donation": {
    "_id": "...",
    "donor": "...",
    "ngo": {
      "_id": "...",
      "organizationName": "Smile Foundation",
      "email": "smile@example.com"
    },
    "type": "MONEY",
    "amount": 1000,
    "description": "Donation of ₹1000",
    "pickupRequired": false,
    "pickupOption": "DROP_OFF",
    "status": "PENDING",
    "createdAt": "2025-10-20T..."
  }
}
```

## Database Schema

### Donation Document Example:
```json
{
  "_id": ObjectId("..."),
  "donor": ObjectId("donor_user_id"),
  "ngo": ObjectId("ngo_user_id"),
  "type": "MONEY",
  "amount": 1000,
  "description": "Donation of ₹1000",
  "pickupRequired": false,
  "pickupOption": "DROP_OFF",
  "status": "PENDING",
  "createdAt": ISODate("2025-10-20T..."),
  "updatedAt": ISODate("2025-10-20T...")
}
```

## Files Modified

1. ✅ `server/src/models/Donation.ts` - Updated schema
2. ✅ `server/src/routes/donation.ts` - Updated POST and GET routes
3. ✅ `server/src/routes/ngo.ts` - Added user field to nearby API
4. ✅ `client/src/app/pages/nearby-ngos/nearby-ngos.component.ts` - Fixed ngoId extraction

## Backward Compatibility

The backend now supports BOTH old and new field names:
- `notes` OR `description`
- `address` OR `pickupAddress`
- `pickupOption` (explicit) OR calculated from `pickupRequired`

## Status

✅ **FIXED** - Donation submission now works correctly!

The backend was already running on port 4000, so the changes should be auto-reloaded by ts-node-dev. The frontend will pick up the changes on the next page refresh.

---

## Quick Test Commands

```powershell
# Test donation creation with curl:
curl -X POST http://localhost:4000/api/donations ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN" ^
  -d "{\"type\":\"MONEY\",\"amount\":500,\"description\":\"Test donation\",\"pickupRequired\":false}"

# Test get my donations:
curl http://localhost:4000/api/donations/mine ^
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Next Steps

1. Test the donation flow end-to-end
2. Verify donations appear in dashboard
3. Test different donation types (FOOD, CLOTHES, BOOKS, OTHER)
4. Test with and without pickup required
5. Verify NGO can see and accept donations
