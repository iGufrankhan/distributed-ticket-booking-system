#  Complete API Reference

**Base URL:** `http://localhost:5000` (Development) | `https://distributed-ticket-booking-system-api.onrender.com` (Production)

**API Version Prefix:** `/api/v1`

**Authentication Header:** `Authorization: Bearer <accessToken>`

---

##  Health Check
- `GET /` — API health status

---

##  Authentication (`/api/v1/auth`)

### Email-Based Authentication
- `POST /send-otp` — Send OTP to email (Step 1)
- `POST /verify-otp` — Verify OTP (Step 2)
- `POST /register` — Complete registration with token (Step 3) **[NEW: requires verificationToken]**
- `POST /login` — Login with email & password
- `POST /resend-otp` — Resend OTP if expired

### OAuth Callbacks
- `GET /google/callback` — Google OAuth callback
- `GET /github/callback` — GitHub OAuth callback

### Account Management
- `POST /change-password` — Change password **(auth required)**
- `POST /logout` — Logout **(auth required)**
- `POST /refresh-token` — Refresh access token **(auth required)**
- `GET /me` — Get current user profile **(auth required)**

### Password Reset
- `POST /forgot-password` — Send password reset OTP
- `POST /reset-password` — Reset password with OTP & verification

---

##  Two-Factor Authentication (`/api/v1/2fa`)

- `POST /enable/request` — Request 2FA setup **(auth required)**
- `POST /enable/verify` — Verify OTP and enable 2FA **(auth required)**
- `POST /disable` — Disable 2FA **(auth required)**
- `POST /verify` — Verify 2FA during login

---

##  Newsletter (`/api/v1/newsletter`)

- `POST /subscribe` — Subscribe to newsletter **(auth required)**
- `POST /unsubscribe` — Unsubscribe from newsletter **(auth required)**

---

##  User Endpoints (`/api/v1/user`)

### Profile Management
- `GET /profile` — Get user profile **(auth required)**
- `PUT /profile` — Update profile **(auth required)**
- `DELETE /profile` — Delete account **(auth required)**

### Movies
- `GET /movies` — Get all movies
- `GET /movies/search` — Search movies by title, genre, etc.
- `GET /movies/:movieId` — Get movie details

### Venues (Theaters)
- `GET /venues` — Get all venues
- `GET /venues/search` — Search venues
- `GET /venues/city/:city` — Get venues by city
- `GET /venues/:venueId` — Get venue details

### Shows
- `GET /shows` — Get all shows
- `GET /shows/filter` — Filter shows by city, date, price, etc.
- `GET /shows/movie/:movieId` — Get shows for a specific movie
- `GET /shows/:showId` — Get show details with seat availability

### Orders
- `GET /orders` — Get user's orders **(auth required)**
- `GET /orders/:orderId` — Get order details **(auth required)**

### Offers & Coupons
- `GET /offers` — Get all available offers
- `GET /offers/trending` — Get trending offers
- `GET /offers/category/:category` — Get offers by category (MOVIE/RESTAURANT/OTT)
- `GET /offers/:offerId` — Get offer details
- `POST /offers/:offerId/use` — Apply coupon code **(auth required)**

### Restaurants & Food
- `GET /restaurants` — Get all restaurants
- `GET /restaurants/top-rated` — Get top-rated restaurants
- `GET /restaurants/city/:city` — Get restaurants by city
- `GET /restaurants/:restaurantId` — Get restaurant details

### OTT (Streaming Services)
- `GET /ott` — Get all OTT content
- `GET /ott/trending` — Get trending content
- `GET /ott/new-releases` — Get newly released content
- `GET /ott/recommended` — Get recommended content
- `GET /ott/platform/:platform` — Get content by platform (Netflix, Prime, Hotstar, etc.)
- `GET /ott/:ottId` — Get OTT content details

---

##  Bookings (`/api/v1/bookings`) — All require authentication

### Booking Operations
- `POST /book` — Create booking (lock seats for 5 mins)
- `POST /confirm` — Confirm booking & process payment
- `PATCH /cancel/:bookingId` — Cancel booking
- `GET /status/:bookingId` — Get booking status
- `GET /my-bookings` — Get all user's bookings

---

## � Payment Gateway (`/api/v1/payment`) — All require authentication

### Razorpay Integration (Production-Ready)

**Payment Processing Flow:**
1. Create order (`POST /create-order`)
2. Generate payment options (`POST /generate-options`)
3. Client-side: Open Razorpay payment modal
4. Verify signature (`POST /verify-signature`)
5. Fetch details if needed (`GET /details/:paymentId`)
6. Handle refunds (`POST /refund`)

### Payment Endpoints

#### 1. Create Payment Order (Server-side)
```
POST /create-order
Required: Bearer token (JWT)
Body: {
  "amount": 5000,           // Amount in paise (₹50)
  "currency": "INR",        // Default: INR
  "receipt": "UNIQUE_ID"    // Unique for each order
}
Response: {
  "id": "order_xxxxx",
  "entity": "order",
  "amount": 5000,
  "amount_paid": 0,
  "amount_due": 5000,
  "currency": "INR",
  "receipt": "UNIQUE_ID",
  "status": "created",
  "created_at": 1234567890
}
```

#### 2. Generate Payment Options (Client-side)
```
POST /generate-options
Required: Bearer token (JWT)
Body: {
  "orderId": "order_xxxxx",          // From create-order response
  "amount": 5000,
  "customerDetails": {
    "name": "John Doe",              // Optional
    "email": "john@example.com",     // Optional
    "contact": "+919999999999"       // Optional
  }
}
Response: {
  "key_id": "rzp_live_xxxxx",
  "order_id": "order_xxxxx",
  "amount": 5000,
  "currency": "INR",
  "customer": { name, email, contact },
  "theme": { color: "#F37254" },
  "description": "Ticket Booking",
  "prefill": { ... }
}
```

#### 3. Verify Payment Signature
```
POST /verify-signature
Required: Bearer token (JWT)
Body: {
  "orderId": "order_xxxxx",        // From Razorpay response
  "paymentId": "pay_xxxxx",        // From Razorpay response
  "signature": "signature_xxxxx"   // From Razorpay response
}
Response: {
  "verified": true | false,
  "message": "Payment verified successfully" | "Signature verification failed",
  "paymentId": "pay_xxxxx"
}
```

#### 4. Fetch Payment Details
```
GET /details/:paymentId
Required: Bearer token (JWT)
Response: {
  "id": "pay_xxxxx",
  "entity": "payment",
  "amount": 5000,
  "currency": "INR",
  "status": "captured" | "failed" | "authorized",
  "method": "card" | "netbanking" | "wallet" | "upi",
  "description": "Ticket Booking",
  "amount_refunded": 0,
  "refund_status": null,
  "captured": true,
  "description": "Ticket Booking",
  "card_id": "card_xxxxx",
  "bank": null,
  "wallet": null,
  "vpa": null,
  "email": "john@example.com",
  "contact": "+919999999999",
  "created_at": 1234567890
}
```

#### 5. Process Refund
```
POST /refund
Required: Bearer token (JWT)
Body: {
  "paymentId": "pay_xxxxx",    // Payment to refund
  "amount": 2500               // Optional: for partial refund (in paise)
}
Response: {
  "id": "rfnd_xxxxx",
  "entity": "refund",
  "payment_id": "pay_xxxxx",
  "amount": 5000,              // Full or partial amount
  "currency": "INR",
  "receipt": null,
  "status": "processed",
  "speed_processed": "instant",
  "speed_requested": "optimum",
  "created_at": 1234567890
}
```

#### 6. Simulate Payment (Testing)
```
POST /process
Required: Bearer token (JWT)
Body: {
  "amount": 5000,
  "method": "CARD"  // CARD, NETBANKING, WALLET, UPI, EMI
}
Response: {
  "success": true,
  "paymentId": "sim_xxxxx",
  "amount": 5000,
  "method": "CARD",
  "message": "Payment simulated successfully"
}
Note: 90% success rate for testing
```

---

##  Validation Rules

### Amount Validation
- **Minimum:** ₹1 (100 paise)
- **Maximum:** ₹10,000 (1,000,000 paise)
- **Type:** Integer (no decimals)

### Payment Methods
- `CARD` - Credit/Debit card
- `NETBANKING` - Net banking
- `WALLET` - Digital wallets (Paytm, PhonePe, etc.)
- `UPI` - Unified Payments Interface
- `EMI` - Equated Monthly Installments

### Error Codes
| Status | Code | Message |
|--------|------|---------|
| 400 | INVALID_AMOUNT | Amount must be between ₹1 and ₹10,000 |
| 400 | INVALID_METHOD | Payment method not supported |
| 401 | INVALID_SIGNATURE | Signature verification failed |
| 401 | UNAUTHORIZED | JWT token missing or invalid |
| 404 | ORDER_NOT_FOUND | Payment order not found |
| 408 | PAYMENT_TIMEOUT | Payment processing timeout |
| 402 | REFUND_FAILED | Refund could not be processed |

---

## � Admin Endpoints (`/api/v1/admin`) — All require admin authentication

### Movie Management
- `POST /movies` — Create movie
- `GET /movies` — Get all movies
- `GET /movies/:id` — Get movie details
- `PATCH /movies/:id` — Update movie
- `DELETE /movies/:id` — Delete movie

### Venue Management
- `POST /venues` — Create venue/theater
- `GET /venues` — Get all venues
- `GET /venues/:id` — Get venue details
- `PATCH /venues/:id` — Update venue
- `DELETE /venues/:id` — Delete venue

### Show Management
- `POST /shows` — Create show
- `GET /shows/now-playing` — Get currently playing shows
- `PUT /shows/:showId` — Update show details
- `PATCH /shows/:showId/cancel` — Cancel single show
- `PATCH /shows/:showId/complete` — Mark show as completed
- `POST /shows/bulk-cancel` — Cancel multiple shows
- `DELETE /shows/:showId` — Delete show

### Seat Management
- `POST /seats` — Bulk add seats to a show
- `GET /seats/:showId` — Get all seats for a show

### Queue Monitoring & Management
#### Statistics & Health
- `GET /queue/stats` — Get queue statistics
- `GET /queue/health` — Get queue health status
- `GET /queue/job/:jobId` — Get specific job details

#### Job Status Views
- `GET /queue/failed` — Get failed payment jobs
- `GET /queue/active` — Get active payment jobs
- `GET /queue/waiting` — Get waiting payment jobs
- `GET /queue/completed` — Get completed payment jobs

#### Job Management
- `POST /queue/retry/:jobId` — Retry a failed job
- `POST /queue/retry-all` — Retry all failed jobs
- `DELETE /queue/job/:jobId` — Delete a specific job
- `POST /queue/clean` — Clean old/completed jobs
- `POST /queue/pause` — Pause queue processing
- `POST /queue/resume` — Resume queue processing
- `DELETE /queue/empty` — Empty entire queue

### Notification Management
- `POST /notifications/all` — Send notification to all users
- `POST /notifications/movie/:movieId` — Notify movie watchers
- `POST /notifications/venue/:venueId` — Notify venue followers
- `POST /notifications/show/:showId` — Notify show attendees
- `POST /notifications/schedule` — Schedule notification for later
- `GET /notifications` — Get all notifications sent

### Newsletter Management
- `POST /newsletter/send` — Send newsletter to subscribers

---

##  Common Query Parameters

### Pagination
- `page=1` — Page number (default: 1)
- `limit=10` — Items per page (default: 10)

### Filtering (Varies by endpoint)
- `city` — Filter by city name
- `genre` — Filter by movie genre
- `date` — Filter by date
- `minPrice`, `maxPrice` — Filter by price range
- `rating` — Filter by rating
- `status` — Filter by status

### Sorting
- `sortBy=createdAt` — Sort field
- `order=asc|desc` — Sort direction

---

##  Request/Response Format

### Success Response (200-201)
```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "Success message",
  "success": true
}
```

### Error Response (4xx-5xx)
```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": ["Detailed error"],
  "data": null,
  "success": false
}
```

---

##  Authentication Flow

1. **Register**: `POST /send-otp` → `POST /verify-otp` → `POST /register` (with verificationToken)
2. **Login**: `POST /login` → Get accessToken & refreshToken
3. **Protected Routes**: Include `Authorization: Bearer <accessToken>` header
4. **Refresh Token**: `POST /refresh-token` when accessToken expires

---

##  Rate Limiting

- **OTP endpoints**: 3 requests per 5 minutes
- **Login endpoint**: 5 attempts per 10 minutes
- **Password change**: 3 attempts per 30 minutes
- **Other endpoints**: Standard rate limiting applied

---

##  Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden (requires admin) |
| 404 | Not Found |
| 409 | Conflict (duplicate email, etc.) |
| 500 | Server Error |

---
