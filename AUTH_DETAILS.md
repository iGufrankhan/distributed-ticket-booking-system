# Authentication System Documentation

## Overview
Complete authentication system with email/password signup, OAuth, 2FA, password reset, and JWT-based authorization.

---

## Features
✅ Email signup with OTP verification  
✅ Login with email/password  
✅ OAuth (Google, GitHub)  
✅ Two-Factor Authentication (2FA)  
✅ Password reset with OTP  
✅ JWT authentication  
✅ Protected routes  
✅ Rate limiting  
✅ Account lockout after failed attempts  
✅ Email verification enforcement  
✅ Resend OTP functionality  

---

## API Endpoints

### 1. **Signup Flow**

#### Step 1: Send OTP
```http
POST /api/auth/send-otp
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
  "message": "OTP sent to your email"
}
```

#### Step 2: Verify OTP
```http
POST /api/auth/verify-otp
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
  "message": "OTP verified successfully"
}
```

#### Step 3: Complete Registration
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "user@example.com",
  "password": "Test@123"
}
```
**Response:**
```json
{
  "statusCode": 201,
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "user@example.com",
    "username": "user"
  },
  "message": "User registered successfully"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

---

### 2. **Login**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Test@123"
}
```

**Response (Without 2FA):**
```json
{
  "statusCode": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "user@example.com",
      "username": "user",
      "isAdmin": false
    }
  },
  "message": "Login successful"
}
```

**Response (With 2FA Enabled):**
```json
{
  "statusCode": 200,
  "data": {
    "requires2FA": true,
    "email": "user@example.com"
  },
  "message": "2FA code sent to your email. Please verify to complete login."
}
```

**Rate Limiting:** 10 requests per 15 minutes  
**Account Lockout:** After 5 failed login attempts

---

### 3. **Protected Routes**

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```
**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "id": "...",
    "fullName": "John Doe",
    "email": "user@example.com",
    "username": "user",
    "isAdmin": false,
    "isEmailVerified": true,
    "twoFactorEnabled": false
  },
  "message": "User profile fetched successfully"
}
```

---

### 4. **Two-Factor Authentication (2FA)**

#### Enable 2FA - Step 1: Request OTP
```http
POST /api/2fa/enable/request
Authorization: Bearer <token>
```
**Response:**
```json
{
  "statusCode": 200,
  "data": { "email": "user@example.com" },
  "message": "OTP sent to your email. Verify to enable 2FA."
}
```

#### Enable 2FA - Step 2: Verify OTP
```http
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
  "data": null,
  "message": "2FA enabled successfully"
}
```

#### Verify 2FA During Login
```http
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
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { ... }
  },
  "message": "Login successful"
}
```

#### Disable 2FA
```http
POST /api/2fa/disable
Authorization: Bearer <token>
Content-Type: application/json

{
  "password": "Test@123"
}
```
**Response:**
```json
{
  "statusCode": 200,
  "data": null,
  "message": "2FA disabled successfully"
}
```

---

### 5. **Password Reset**

#### Step 1: Request Password Reset
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```
**Response:**
```json
{
  "statusCode": 200,
  "message": "Password reset OTP sent to your email"
}
```

**Rate Limiting:** 5 requests per 10 minutes

#### Step 2: Reset Password with OTP
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "NewTest@123"
}
```
**Response:**
```json
{
  "statusCode": 200,
  "message": "Password reset successful"
}
```

---

### 6. **Other Endpoints**

#### Resend OTP
```http
POST /api/auth/resend-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```
**Rate Limiting:** 5 requests per 10 minutes

#### Logout
```http
POST /api/auth/logout
```
**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully. Please delete token on client."
}
```

**Note:** Client must delete the token from storage as JWT tokens remain valid until expiry.

---

## Authentication Flow Diagrams

### Normal Signup & Login
```
1. Send OTP → Email → Verify OTP
2. Complete Registration → User Created
3. Login → JWT Token → Access Protected Routes
```

### Login with 2FA Enabled
```
1. Login (email + password) → 2FA OTP Sent
2. Verify 2FA OTP → JWT Token → Access Protected Routes
```

### Enable 2FA
```
1. Request 2FA Enable → OTP Sent
2. Verify OTP → 2FA Enabled
3. Next Login → Requires 2FA Verification
```

---

## Security Features

### 1. **JWT Tokens**
- **Expiration:** 7 days
- **Payload:** `{ userId, iat, exp }`
- **Algorithm:** HS256
- **Secret:** Environment variable `JWT_SECRET`

### 2. **Password Security**
- Hashed using bcrypt (10 salt rounds)
- Strong password validation enforced
- Password not returned in API responses (select: false)

### 3. **Rate Limiting**
| Endpoint | Limit | Window |
|----------|-------|--------|
| OTP endpoints | 5 requests | 10 minutes |
| Login | 10 requests | 15 minutes |

### 4. **Account Protection**
- **Failed Login Attempts:** Max 5 attempts
- **Account Lockout:** After 5 failed attempts
- **Email Verification:** Required before login
- **OTP Expiration:** 10 minutes
- **Auto-delete:** Expired OTPs removed automatically

### 5. **OTP Purposes**
- `signup` - Email verification during signup
- `resetPassword` - Password reset verification
- `enable2FA` - Enabling 2FA verification
- `login2FA` - Login with 2FA verification

---

## Database Models

### User Schema
```javascript
{
  fullName: String (required),
  username: String (unique, auto-generated),
  email: String (required, unique, lowercase),
  password: String (hashed, select: false),
  authProvider: "email" | "google" | "github",
  googleId: String,
  githubId: String,
  isEmailVerified: Boolean (default: false),
  isLocked: Boolean (default: false),
  failedLoginAttempts: Number (default: 0),
  twoFactorEnabled: Boolean (default: false),
  isAdmin: Boolean (default: false),
  phone: String,
  timestamps: true
}
```

### OTP Schema
```javascript
{
  email: String (required, lowercase),
  otp: String (required),
  purpose: "signup" | "resetPassword" | "enable2FA" | "login2FA",
  expiresAt: Date (TTL index, auto-delete on expiry),
  timestamps: true
}
```

---

## Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/ticket-booking

# JWT
JWT_SECRET=your-secret-key-here

# Email Service
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# App
PORT=3000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

---

## Error Handling

### Common Error Responses

**400 Bad Request**
```json
{
  "statusCode": 400,
  "message": "Invalid or expired OTP",
  "success": false
}
```

**401 Unauthorized**
```json
{
  "statusCode": 401,
  "message": "Invalid access token",
  "success": false
}
```

**403 Forbidden**
```json
{
  "statusCode": 403,
  "message": "Account is locked. Please contact support.",
  "success": false
}
```

**409 Conflict**
```json
{
  "statusCode": 409,
  "message": "User with this email already exists",
  "success": false
}
```

**429 Too Many Requests**
```json
{
  "statusCode": 429,
  "message": "Too many attempts. Try again later.",
  "success": false
}
```

---

## Testing with Postman

### Setup Authorization
1. Get token from login response
2. In Postman → Authorization tab
3. Type: **Bearer Token**
4. Token: Paste your JWT token

### Testing Checklist
- [ ] Signup flow (send OTP → verify → register)
- [ ] Login without 2FA
- [ ] Enable 2FA
- [ ] Login with 2FA
- [ ] Disable 2FA
- [ ] Password reset
- [ ] Protected routes with token
- [ ] Rate limiting (try multiple rapid requests)
- [ ] Account lockout (5 failed logins)
- [ ] Resend OTP

---

## Production Recommendations

### Missing Features for 100% Production Ready:
1. **Refresh Token System** ⚠️
   - Short-lived access tokens (15-30 min)
   - Long-lived refresh tokens (7-30 days)
   - Token rotation on refresh
   
2. **Token Blacklist** ⚠️
   - Invalidate tokens on logout
   - Store blacklisted tokens in Redis
   
3. **Security Headers**
   - Use `helmet` middleware
   - CORS configuration
   - HTTPS enforcement
   
4. **Session Management**
   - Track active sessions
   - View/revoke sessions endpoint
   
5. **Additional Features**
   - Change password (for logged-in users)
   - Email verification resend
   - Password history (prevent reuse)

### Current Status
**~85% Production Ready**  
Core authentication is solid. Main gap is refresh token system.

---

## File Structure

```
src/
├── controllers/
│   ├── auth.controllers.js
│   ├── 2fa.controllers.js
│   ├── logOut.controllers.js
│   ├── resetPassword.controllers.js
│   └── outh.controllers.js
├── services/
│   ├── auth.service.js
│   ├── 2fa.service.js
│   ├── resetPassword.service.js
│   └── outh.service.js
├── models/
│   ├── user.models.js
│   └── otp.models.js
├── middlewares/
│   └── auth/
│       ├── auth.middlewares.js
│       ├── validate.middleware.js
│       └── rateLimiter.middlewares.js
├── routes/
│   └── authRoutes/
│       ├── auth.routes.js
│       ├── 2fa.routes.js
│       ├── resetPassword.routes.js
│       └── outh.routes.js
└── lib/
    └── functions/
        └── auth/
            ├── emailSignup.js
            └── sendOtp.js

utils/
├── validators/
│   └── auth.validators.js
├── emailservices/
│   ├── createTransporter.js
│   └── generateOtp.js
├── ApiError.js
├── ApiResponse.js
├── AsyncHandler.js
├── constant.js
└── token.js
```

---

## Support

For issues or questions:
- Check error messages in response
- Verify environment variables are set
- Ensure MongoDB is running
- Check email service configuration
- Review rate limiting if getting 429 errors

---

**Last Updated:** December 14, 2025  
**Version:** 1.0  
