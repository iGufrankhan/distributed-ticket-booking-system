# 🎟️ Phase 3: Booking & Payment System

Short, clear guide to how seat locking and payment processing work in this project.

---

## 🚦 How It Works
- **Redis locks** seats for 5 minutes to prevent double-booking
- **Payment jobs** are queued and processed in the background
- **Auto-cancel**: If payment not completed in 5 min, seats are released
- **Admin** can monitor and retry failed jobs

---

## 🗂️ Main Models
- **Show:** movieId, theaterId, startTime, price, availableSeats
- **Seat:** showId, seatNumber, status (available/locked/booked), lockedBy
- **Booking:** userId, showId, seats[], status, bookingCode, totalAmount
- **Payment:** userId, orderId, amount, status, expiresAt

---

## 🔄 Booking Flow
1. **Book Seats**
   - `POST /api/v1/bookings/book`
   - Locks seats in Redis, creates payment, queues job
2. **Payment Processing** (Worker)
   - Success: Booking created, seats marked booked
   - Fail/Timeout: Seats unlocked, status updated
3. **Confirm Booking**
   - `POST /api/v1/bookings/confirm`
4. **Check Status**
   - `GET /api/v1/bookings/status/:bookingId`
5. **My Bookings**
   - `GET /api/v1/bookings/my-bookings`
6. **Cancel Booking**
   - `PATCH /api/v1/bookings/cancel/:bookingId`

---

## 🛠️ Admin Tools
- **Queue stats:** `GET /admin/queue/stats`
- **Failed jobs:** `GET /admin/queue/failed`
- **Retry job:** `POST /admin/queue/retry/:jobId`
- **Pause/Resume:** `POST /admin/queue/pause` | `/resume`

---

## ⚙️ Config
```env
SEAT_LOCK_EXPIRY=5          # Minutes
PAYMENT_TIMEOUT=300000      # 5 min in ms
MAX_SEATS_PER_BOOKING=10
```
- **Redis key:** `seatlock:{showId}:{seats}` (TTL: 300s)

---

## 🚀 Run Locally
```bash
npm start        # API server
npm run worker   # Payment worker
```
_Both must run together!_

---

## ⭐ Highlights
- No double-booking: atomic seat locks
- Fast user experience: async payments
- Auto-release: no stuck seats
- Admin can monitor and fix issues

