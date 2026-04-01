# Two-Factor Authentication (2FA) Guide

Current route prefixes:
- Auth: `/api/v1/auth`
- 2FA: `/api/v1/2fa`

## Enable 2FA (Authenticated)

### 1) Request OTP
`POST /api/v1/2fa/enable/request`

Headers:
- `Authorization: Bearer <accessToken>`

### 2) Verify OTP and Enable
`POST /api/v1/2fa/enable/verify`

Headers:
- `Authorization: Bearer <accessToken>`

Body:
```json
{
  "otp": "123456"
}
```

## Disable 2FA (Authenticated)
`POST /api/v1/2fa/disable`

Headers:
- `Authorization: Bearer <accessToken>`

Body:
```json
{
  "password": "your_password"
}
```

## Login Flow When 2FA Is Enabled

### 1) Normal Login Attempt
`POST /api/v1/auth/login`

Body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

If 2FA is enabled, response contains:
- `requires2FA: true`
- `email`

### 2) Verify 2FA OTP
`POST /api/v1/2fa/verify`

Body:
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

On success, API returns auth tokens and user payload.

## Notes
- OTP purpose values include: `enable2FA` and `login2FA`.
- OTPs are one-time and expire.
- Login endpoint triggers sending the login 2FA OTP when needed.
