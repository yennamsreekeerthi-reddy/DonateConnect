# Gmail OTP Setup Guide

## Step 1: Enable 2-Factor Authentication

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** in the left sidebar
3. Scroll to **How you sign in to Google**
4. Click on **2-Step Verification**
5. Follow the steps to enable it

## Step 2: Generate App Password

1. After enabling 2FA, go back to Security
2. Under **2-Step Verification**, click on **App passwords**
3. You might need to sign in again
4. At the bottom, click on **Select app** dropdown
5. Choose **Mail**
6. Click on **Select device** dropdown
7. Choose **Other (Custom name)**
8. Type: `DonateConnect OTP`
9. Click **Generate**
10. Google will display a 16-character password like: `abcd efgh ijkl mnop`
11. **Copy this password** (you won't see it again!)

## Step 3: Update `.env` File

1. Open `server/.env` file
2. Replace these values:

```env
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

**Important Notes:**
- Use the actual Gmail address (e.g., `john.doe@gmail.com`)
- Use the 16-character App Password (remove spaces if copying)
- Do NOT use your regular Gmail password
- Keep the `.env` file secure and never commit it to Git

## Step 4: Rebuild and Restart Server

```bash
cd server
npm run build
```

Then restart the server.

## Step 5: Test OTP Email

1. Go to http://localhost:4200/login
2. Click "📧 Login with OTP"
3. Enter your email address
4. Click "Send OTP"
5. Check your Gmail inbox for the OTP email

## Troubleshooting

### Email not received?

1. **Check spam/junk folder**
2. **Verify App Password**: Make sure it's copied correctly without spaces
3. **Check Gmail address**: Ensure EMAIL_USER is correct
4. **Check console**: OTP is still logged in terminal as backup
5. **Less secure app access**: Make sure 2FA and App Password are properly set up

### "Invalid credentials" error?

- Double-check the App Password
- Remove any spaces from the password
- Make sure you're using App Password, not your regular Gmail password

### "Connection refused" error?

- Check your internet connection
- Gmail might be blocking the connection - try again after a few minutes
- Ensure 2FA is enabled and App Password is generated

### Alternative Email Services

If Gmail doesn't work, you can use:

#### SendGrid (Recommended for production)
```bash
npm install @sendgrid/mail
```

#### AWS SES (Amazon Simple Email Service)
```bash
npm install @aws-sdk/client-ses
```

#### Mailgun
```bash
npm install mailgun-js
```

## Email Template Preview

The OTP email includes:
- 🎯 DonateConnect logo
- Beautiful gradient design
- Large, easy-to-read OTP code
- Expiration warning (10 minutes)
- Security reminder
- Professional styling

## Security Best Practices

✅ **DO:**
- Use App Passwords, not regular passwords
- Keep `.env` file in `.gitignore`
- Rotate App Passwords periodically
- Monitor email sending logs

❌ **DON'T:**
- Share your App Password
- Commit `.env` to version control
- Use the same password for multiple apps
- Send OTPs without expiration

## Support

If you need help:
1. Check the terminal console for error messages
2. Verify all credentials are correct
3. Try generating a new App Password
4. Contact the development team
