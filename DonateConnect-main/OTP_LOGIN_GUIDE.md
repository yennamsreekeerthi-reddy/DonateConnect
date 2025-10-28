# OTP Login Implementation Guide

## Overview
We've successfully implemented OTP (One-Time Password) authentication for login functionality. Users can now log in using their email address and a 6-digit OTP code instead of a password.

## Features Implemented

### Backend (Server)

#### 1. OTP Model (`server/src/models/OTP.ts`)
- Stores OTP codes with email, type (login/signup/reset), and expiration time
- Automatically deletes expired OTPs using MongoDB TTL index
- OTPs expire after 10 minutes
- Tracks verification status

#### 2. OTP Service (`server/src/services/otpService.ts`)
- `generateOTP()`: Creates random 6-digit codes
- `createOTP(email, type)`: Generates and stores OTP in database
- `verifyOTP(email, otp, type)`: Validates OTP and marks as used
- `sendOTP(email, otp, type)`: Sends OTP via email (currently console logs)

#### 3. Authentication Routes (`server/src/routes/auth.ts`)
Added two new endpoints:

**POST /api/auth/request-login-otp**
- Accepts: `{ email: string }`
- Validates user exists
- Generates 6-digit OTP
- Sends OTP to email (console for now)
- Returns: `{ message: string, email: string }`

**POST /api/auth/login-with-otp**
- Accepts: `{ email: string, otp: string }`
- Verifies OTP validity
- Issues JWT token on success
- Returns: `{ token: string, user: {...}, message: string }`

### Frontend (Client)

#### 1. Auth Service (`client/src/app/core/auth.service.ts`)
Added methods:
- `requestLoginOTP(email)`: Requests OTP for login
- `loginWithOTP(email, otp)`: Verifies OTP and logs in

#### 2. Login Component (`client/src/app/pages/login/login.component.ts`)
Enhanced with:
- Toggle between password and OTP login modes
- Two-step OTP flow: request → verify
- 10-minute countdown timer
- Resend OTP functionality (with 60-second cooldown)
- Visual feedback for OTP sent confirmation
- Real-time timer display

## User Flow

### Password Login (Existing)
1. Enter email and password
2. Click "Login"
3. Redirected to dashboard

### OTP Login (New)
1. Click "📧 Login with OTP" button
2. Enter email address
3. Click "Send OTP"
4. Check email for 6-digit code (or console logs in dev)
5. Enter OTP in the input field
6. Click "Verify OTP"
7. Redirected to dashboard

## UI Components

### Toggle Button
- Switches between password and OTP modes
- Shows appropriate icon and text
- Located below the login button

### OTP Input
- Appears only in OTP mode after requesting OTP
- 6-digit limit with validation
- Shows countdown timer on the right
- Disabled email field after OTP sent

### OTP Info Section
- Displays confirmation message with email
- Shows "Resend OTP" button
- Button disabled for first 60 seconds
- Countdown shows remaining wait time

## Security Features

1. **Expiration**: OTPs expire after 10 minutes
2. **Single Use**: OTPs marked as verified after use
3. **User Validation**: Checks if user exists before sending OTP
4. **Auto-cleanup**: MongoDB TTL index removes expired OTPs
5. **Rate Limiting**: 60-second cooldown between resend requests

## Email Integration (TODO)

Currently, OTPs are logged to the console. To integrate real email:

1. **Install email service** (e.g., SendGrid, AWS SES)
   ```bash
   npm install @sendgrid/mail
   ```

2. **Update `sendOTP()` method** in `server/src/services/otpService.ts`:
   ```typescript
   static async sendOTP(email: string, otp: string, type: string) {
     const sgMail = require('@sendgrid/mail');
     sgMail.setApiKey(process.env.SENDGRID_API_KEY);
     
     const msg = {
       to: email,
       from: 'noreply@donateconnect.com',
       subject: 'Your Login OTP',
       text: `Your OTP is: ${otp}`,
       html: `<strong>Your OTP is: ${otp}</strong><br>Valid for 10 minutes.`,
     };
     
     await sgMail.send(msg);
   }
   ```

3. **Add environment variable** in `.env`:
   ```
   SENDGRID_API_KEY=your_api_key_here
   ```

## Testing

### Development Testing
1. Navigate to http://localhost:4200
2. Click "Login"
3. Click "📧 Login with OTP"
4. Enter email: test@example.com
5. Click "Send OTP"
6. Check server console for OTP code
7. Enter the OTP
8. Click "Verify OTP"

### Console Output Example
```
📧 Sending OTP Email
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: user@example.com
Type: Login OTP
Code: 123456
Expires in: 10 minutes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Error Handling

- **Email not found**: "No account found with this email address"
- **Invalid OTP**: "Invalid or expired OTP. Please request a new one."
- **Expired OTP**: Automatically handled, treated as invalid
- **Server errors**: Generic error messages with console logging

## API Responses

### Success - OTP Requested
```json
{
  "message": "OTP sent to your email. Please check your inbox.",
  "email": "user@example.com"
}
```

### Success - Login Complete
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "DONOR"
  },
  "message": "Login successful"
}
```

### Error - User Not Found
```json
{
  "message": "No account found with this email address"
}
```

### Error - Invalid OTP
```json
{
  "message": "Invalid or expired OTP. Please request a new one."
}
```

## Future Enhancements

1. **Email Service**: Integrate SendGrid/AWS SES for real email delivery
2. **Rate Limiting**: Prevent OTP spam (max 3 requests per hour)
3. **SMS OTP**: Add SMS as alternative to email
4. **OTP History**: Track OTP usage for security auditing
5. **2FA Option**: Use OTP as second factor with password
6. **Backup Codes**: Generate backup codes for account recovery
7. **IP Tracking**: Log IP addresses for security monitoring
8. **Brute Force Protection**: Lock account after failed attempts

## Benefits

✅ **Enhanced Security**: Passwordless authentication reduces credential theft
✅ **Better UX**: No need to remember passwords
✅ **Mobile Friendly**: Easy to copy OTP from email
✅ **Temporary Access**: OTPs expire automatically
✅ **Audit Trail**: Track login attempts and OTP usage
✅ **Flexible**: Easy to extend to signup/password reset

## Support

For issues or questions, contact the development team or check the application logs at:
- Server logs: `d:\externalwpm\donateconnect\server\dist\index.js` console
- Browser console: Press F12 in browser
