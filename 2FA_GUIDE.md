# Two-Factor Authentication (2FA) - Implementation Guide

## Overview
Complete 2FA system has been implemented with email-based OTP verification.

## API Endpoints

### 1. Enable 2FA (Protected Routes)

#### Request to Enable 2FA
```
POST /api/2fa/enable/request
Authorization: Bearer <token>
```
Sends OTP to user's email to enable 2FA.

**Response:**
```json
{
  "statusCode": 200,
  "data": { "email": "user@example.com" },
  "message": "OTP sent to your email"
}
```

#### Verify OTP and Enable 2FA
```
POST /api/2fa/enable/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "otp": "123456"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Two-factor authentication enabled successfully"
}
```

#### Disable 2FA
```
POST /api/2fa/disable
Authorization: Bearer <token>
Content-Type: application/json

{
  "password": "your_password"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Two-factor authentication disabled successfully"
}
```

### 2. Login with 2FA (Public Routes)

#### Step 1: Regular Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (if 2FA enabled):**
```json
{
  "statusCode": 200,
  "data": {
    "requires2FA": true,
    "email": "user@example.com"
  },
  "message": "Please verify 2FA code sent to your email"
}
```

#### Step 2: Send 2FA Code
```
POST /api/2fa/send
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "data": { "email": "user@example.com" },
  "message": "2FA code sent to your email"
}
```

#### Step 3: Verify 2FA Code
```
POST /api/2fa/verify
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "2FA verification successful"
}
```

After successful 2FA verification, call the login endpoint again to get the token.

## Database Changes

### User Model Updates
Added field:
- `twoFactorEnabled`: Boolean (default: false)
- `isLocked`: Boolean (default: false)
- `failedLoginAttempts`: Number (default: 0)

### OTP Model Updates
New purposes added:
- `enable2FA`: For enabling 2FA
- `login2FA`: For login verification

## Features Implemented

✅ Enable 2FA with email verification  
✅ Disable 2FA with password confirmation  
✅ Login flow with 2FA verification  
✅ OTP expiration (10 minutes)  
✅ Account lockout after 5 failed login attempts  
✅ Email verification requirement before login  
✅ Auto-delete expired OTPs from database  

## Security Features

1. **OTP Expiry**: All OTPs expire after 10 minutes
2. **One-time Use**: OTPs are deleted after verification
3. **Password Required**: Disabling 2FA requires password confirmation
4. **Account Lockout**: 5 failed login attempts lock the account
5. **Email Verification**: Must verify email before login

## Files Created/Modified

**New Files:**
- `src/services/twoFactorauth.js` - 2FA business logic
- `src/controllers/twoFactor.controllers.js` - 2FA endpoints
- `src/routes/twoFactor.routes.js` - 2FA routes

**Modified Files:**
- `src/models/otp.models.js` - Added new OTP purposes
- `src/models/user.models.js` - Already had required fields
- `src/services/auth.service.js` - Updated login flow for 2FA
- `app.js` - Added 2FA routes

## Usage Flow

### For Users Enabling 2FA:
1. User logs in normally → gets JWT token
2. User calls `/api/2fa/enable/request` → receives OTP via email
3. User calls `/api/2fa/enable/verify` with OTP → 2FA enabled

### For Users with 2FA Enabled:
1. User calls `/api/auth/login` → receives `requires2FA: true`
2. 2FA OTP automatically sent to email
3. User calls `/api/2fa/verify` with OTP → verification successful
4. User calls `/api/auth/login` again → receives JWT token

### For Disabling 2FA:
1. User calls `/api/2fa/disable` with password → 2FA disabled
