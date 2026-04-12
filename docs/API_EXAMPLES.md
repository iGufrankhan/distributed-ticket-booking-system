# 📚 API Request/Response Examples

Complete working examples for all major endpoints with real requests and responses. See [API_REFERENCE.md](./API_REFERENCE.md) for the full endpoint list.

**Base URL:** `http://localhost:5000` (Development) | `https://distributed-ticket-booking-system-api.onrender.com` (Production)

**API Version Prefix:** `/api/v1`

---

## 🔐 Authentication Endpoints

### 1. Send OTP (Step 1)

**Request:**
```bash
POST http://localhost:5000/api/v1/auth/send-otp
Content-Type: application/json
```

```json
{
  "email": "gufrankhankab123@gmail.com"
}
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "email": "gufrankhankab123@gmail.com"
  },
  "message": "OTP sent to your email",
  "success": true
}
```

---

### 2. Verify OTP (Step 2)

**Request:**
```bash
POST http://localhost:5000/api/v1/auth/verify-otp
Content-Type: application/json
```

```json
{
  "email": "gufrankhankab123@gmail.com",
  "otp": "859066"
}
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "email": "gufrankhankab123@gmail.com",
    "verificationToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "OTP verified successfully. Use this token to complete registration.",
  "success": true
}
```

---

### 3. Register User (Step 3)

**Request:**
```bash
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json
```

```json
{
  "fullName": "Gufrankhan",
  "email": "gufrankhankab123@gmail.com",
  "password": "Gufrankhan@123",
  "verificationToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (201 Created):**
```json
{
  "statusCode": 201,
  "data": {
    "id": "69d3d10dd3a7142d3edbab43",
    "name": "Gufrankhan",
    "email": "gufrankhankab123@gmail.com",
    "username": "gufrankhankab123",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQzZDEwZGQzYTcxNDJkM2VkYmFiNDMiLCJpYXQiOjE3MTI0MzA1NDksImV4cCI6MTcxMjQzNjk0OX0...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQzZDEwZGQzYTcxNDJkM2VkYmFiNDMiLCJpYXQiOjE3MTI0MzA1NDksImV4cCI6MTcxNDkyMjk0OX0..."
  },
  "message": "User registered successfully",
  "success": true
}
```

---

### 4. Login

**Request:**
```bash
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json
```

```json
{
  "email": "gufrankaab123@gmail.com",
  "password": "Gufrankhan@111"
}
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQxNGEyZjZlZTc3ZTRkY2IzOWMxYmQiLCJpYXQiOjE3MTI0MzA1NDksImV4cCI6MTcxMjQzNjk0OX0...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQxNGEyZjZlZTc3ZTRkY2IzOWMxYmQiLCJpYXQiOjE3MTI0MzA1NDksImV4cCI6MTcxNDkyMjk0OX0...",
    "user": {
      "_id": "69d14a2f6ee77e4dcb39c1bd",
      "name": "Gufrankhan",
      "email": "gufrankaab123@gmail.com",
      "username": "gufrankaab123",
      "isAdmin": false
    }
  },
  "message": "Login successful",
  "success": true
}
```

---

### 5. Get All Venues

**Request:**
```bash
GET http://localhost:5000/api/v1/user/venues
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": "Venues fetched successfully",
  "message": [
    {
      "_id": "694bcccc5d0c037926f6bd54",
      "name": "PVR Phoenix Mall",
      "city": "Mumbai",
      "address": "Lower Parel, Mumbai 400013",
      "totalSeats": 1200,
      "isActive": true,
      "createdAt": "2025-12-24T11:21:48.983Z",
      "updatedAt": "2025-12-24T11:21:48.983Z"
    },
    {
      "_id": "694bcce75d0c037926f6bd57",
      "name": "INOX R City Mall",
      "city": "Mumbai",
      "address": "Ghatkopar, Mumbai 400086",
      "totalSeats": 900,
      "isActive": true,
      "createdAt": "2025-12-24T11:22:10.234Z",
      "updatedAt": "2025-12-24T11:22:10.234Z"
    }
  ],
  "success": true
}
```

---

### 6. Book Seats (Create Booking)

**Request:**
```bash
POST http://localhost:5000/api/v1/bookings/book
Content-Type: application/json
Authorization: Bearer <accessToken>
```

```json
{
  "showId": "60d5ec49c1234567890xyz01",
  "seats": ["A1", "A2", "A3"]
}
```

**Response (201 Created):**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "60d5ec49c1234567890book1",
    "userId": "69d1a2f6ee77e4dcb39c1bd",
    "showId": "60d5ec49c1234567890xyz01",
    "seats": ["A1", "A2", "A3"],
    "totalAmount": 1050,
    "status": "PENDING",
    "bookingCode": "BK123456789",
    "expiresAt": "2026-04-06T16:35:00.000Z",
    "createdAt": "2026-04-06T16:30:00.000Z"
  },
  "message": "Booking confirmed. Seats locked for 5 minutes.",
  "success": true
}
```

---

### 7. Get Current User Profile

**Request:**
```bash
GET http://localhost:5000/api/v1/user/profile
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": "User profile fetched successfully",
  "message": {
    "_id": "69d14a2f6ee77e4dcb39c1bd",
    "fullName": "Gufrankhan",
    "username": "gufrankaab123",
    "email": "gufrankaab123@gmail.com",
    "authProvider": "email",
    "isblocked": false,
    "isEmailVerified": true,
    "isLocked": false,
    "failedLoginAttempts": 0,
    "twoFactorEnabled": false,
    "isAdmin": false,
    "newsletterSubscribed": false,
    "createdAt": "2026-04-06T17:28:15.018Z",
    "updatedAt": "2026-04-06T16:36:25.275Z"
  },
  "success": true
}
```

---

## 🔑 Common Reference

**Authorization Header Format:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI...
```

**Pagination (Query Parameters):**
```bash
GET /api/v1/user/movies?page=1&limit=10
GET /api/v1/user/shows?sortBy=showDateTime&order=asc
```

---
