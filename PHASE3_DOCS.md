# 📋 Phase 3: Booking System & Payment Queue

Documentation for seat locking and payment processing.

---

## 🎯 Overview

Handles concurrent bookings with Redis locks and async payment processing using Bull queues.

---

## 📦 Models

**Show:** movieId, theaterId, startTime, price, availableSeats  
**Seat:** showId, seatNumber, status (available/locked/booked), lockedBy  
**Booking:** userId, showId, seats[], status, bookingCode, totalAmount  
**Payment:** userId, orderId, amount, status, expiresAt  

---

## 🔄 Booking Flow

### 1. Book Seats
```bash
POST /api/v1/bookings/book
{ "showId": "...", "seats": ["A1", "A2"] }
```
**Process:** Validate → Lock seats in Redis (5 min) → Create payment → Queue job

### 2. Payment Processing (Worker)
**Success:** Create booking → Mark seats booked  
**Failed:** Unlock seats → Update status  
**Timeout:** Auto-cancel after 5 min

### 3. Confirm Booking
```bash
POST /api/v1/bookings/confirm
{ "paymentId": "..." }
```

### 4. Check Status
```bash
GET /api/v1/bookings/status/:bookingId
```

### 5. My Bookings
```bash
GET /api/v1/bookings/my-bookings
```

### 6. Cancel Booking
```bash
PATCH /api/v1/bookings/cancel/:bookingId
```

---

## 🎛️ Admin Queue Monitoring

**Stats:** `GET /admin/queue/stats`  
**Failed Jobs:** `GET /admin/queue/failed`  
**Retry Job:** `POST /admin/queue/retry/:jobId`  
**Pause/Resume:** `POST /admin/queue/pause` | `/resume`

---

## ⚙️ Configuration

```env
SEAT_LOCK_EXPIRY=5          # Minutes
PAYMENT_TIMEOUT=300000      # 5 min in ms
MAX_SEATS_PER_BOOKING=10
```

**Redis Keys:**  
`seatlock:{showId}:{seats}` → TTL: 300s

---

## 🔒 Key Features

- **Prevents double-booking** - Redis atomic locks
- **Background processing** - Bull queue with 3 retries
- **Auto-timeout** - Seats unlock after 5 min
- **Admin monitoring** - View/retry failed payments

---

## 🚀 Running

```bash
npm start          # API server
npm run worker     # Payment worker
```

**Both must run together!**

---

**Phase 3 Complete! 🎉**
