# Authentication Details (Current)

## Overview
Authentication includes:
- email signup with OTP
- email/password login
- Google/GitHub OAuth callbacks
- 2FA support
- password reset OTP flow
- access + refresh tokens

API version prefix: `/api/v1`

## Core Auth Endpoints (`/api/v1/auth`)
- `POST /send-otp`
- `POST /verify-otp`
- `POST /register`
- `POST /login`
- `POST /resend-otp`
- `POST /change-password` (auth required)
- `POST /logout`
- `POST /refresh-token`
- `GET /me` (auth required)
- `POST /forgot-password`
- `POST /reset-password`

## OAuth Endpoints (`/api/v1/auth`)
- `GET /google/callback`
- `GET /github/callback`

## 2FA Endpoints (`/api/v1/2fa`)
- `POST /enable/request` (auth required)
- `POST /enable/verify` (auth required)
- `POST /disable` (auth required)
- `POST /verify`

## Token Behavior
- Access token: used for protected APIs in `Authorization` header.
- Refresh token: used for `POST /api/v1/auth/refresh-token` and logout revocation flow.
- Login/register/OAuth flows return auth tokens.

## User Model Auth Fields
- `email`
- `password`
- `refreshToken`
- `isEmailVerified`
- `isLocked`
- `failedLoginAttempts`
- `twoFactorEnabled`
- `isAdmin`
- `authProvider`

## Security Notes
- Passwords are hashed with bcrypt.
- OTPs are time-bound and one-time-use.
- Account lockout after repeated failed attempts is implemented.
- Admin authorization is based on `isAdmin: true`.

## Important Implementation Notes
- Admin role is `isAdmin` (boolean), not `role` string.
- Routes use `/api/v1/*` prefixes.
- There is centralized not-found and error middleware in app setup.
