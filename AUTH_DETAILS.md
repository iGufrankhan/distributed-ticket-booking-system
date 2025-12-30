# 🔐 Authentication System Documentation

## Overview
A complete authentication system with email/password signup, OAuth, 2FA, password reset, and JWT-based authorization.

---

## ✅ Features
- Email signup with OTP verification
- Login with email/password
- OAuth (Google, GitHub)
- Two-Factor Authentication (2FA)
- Password reset with OTP
- JWT authentication
- Protected routes
- Rate limiting
- Account lockout after failed attempts
- Email verification enforcement
- Resend OTP functionality

---

## 🚦 API Endpoints

### 1. Signup Flow
- `POST /api/auth/send-otp` — Send OTP to email
- `POST /api/auth/verify-otp` — Verify OTP
- `POST /api/auth/register` — Complete registration

### 2. Login
- `POST /api/auth/login` — Login (with/without 2FA)

### 3. Protected Routes
- `GET /api/auth/me` — Get current user (JWT required)

### 4. Two-Factor Authentication (2FA)
- `POST /api/2fa/enable/request` — Request OTP to enable 2FA
- `POST /api/2fa/enable/verify` — Verify OTP to enable 2FA
- `POST /api/2fa/verify` — Verify 2FA during login
- `POST /api/2fa/disable` — Disable 2FA

### 5. Password Reset
- `POST /api/auth/forgot-password` — Request password reset OTP
- `POST /api/auth/reset-password` — Reset password with OTP

### 6. Other
- `POST /api/auth/resend-otp` — Resend OTP
- `POST /api/auth/logout` — Logout

---

## 🔒 Security Features
- JWT tokens (7 days, HS256)
- Passwords hashed with bcrypt
- Strong password validation
- Rate limiting (login, OTP, reset)
- Account lockout after 5 failed logins
- Email verification required
- OTPs expire in 10 minutes

---

## 🗂️ Models

### User
```js
{
  fullName, username, email, password, authProvider,
  googleId, githubId, isEmailVerified, isLocked,
  failedLoginAttempts, twoFactorEnabled, isAdmin, phone
}
```

### OTP
```js
{
  email, otp, purpose, expiresAt
}
```

---

## 📝 Environment Variables

```env
MONGODB_URI=...
JWT_SECRET=...
EMAIL_SERVICE=...
EMAIL_USER=...
EMAIL_PASSWORD=...
EMAIL_FROM=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
PORT=3000
CLIENT_URL=...
NODE_ENV=development
```

---

## 🧪 Testing Checklist
- [ ] Signup (send OTP → verify → register)
- [ ] Login (with/without 2FA)
- [ ] Enable/disable 2FA
- [ ] Password reset
- [ ] Protected routes
- [ ] Rate limiting/account lockout
- [ ] Resend OTP

---

## 🗂️ File Structure
```
src/
├── controllers/auth/
├── services/auth/
├── models/
├── middlewares/auth/
├── routes/authRoutes/
└── utils/
```

---

## 💡 Production Tips
- Add refresh token system for 100% production readiness
- Use token blacklist for logout
- Add security headers (helmet, CORS)
- Track active sessions
- Add change password & password history

---

**For full request/response samples, see the detailed endpoint sections above.**

---

_Last updated: December 31, 2025_
