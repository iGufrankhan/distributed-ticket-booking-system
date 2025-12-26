# 🎬 Distributed Ticket Booking System

A scalable movie ticket booking API with Redis-based seat locking, payment queues, and real-time concurrency handling.

[![Node.js](https://img.shields.io/badge/Node.js-v22.17.1-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-blue)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-Queue-red)](https://redis.io/)

---

## 📖 About

A production-ready ticket booking backend handling concurrent bookings, payment timeouts, and distributed locks. Built to understand how real booking systems prevent double-booking and handle failures.

---

## ✨ Features

- **Seat Locking**: Redis prevents race conditions
- **Auto-Cancellation**: BullMQ releases seats after timeout
- **OAuth Login**: Google & GitHub authentication
- **2FA**: Email OTP + TOTP support
- **Queue Monitoring**: Admin dashboard for failed jobs
- **Email Notifications**: Booking confirmations

---

## 🛠️ Tech Stack

```
Backend:    Node.js, Express
Database:   MongoDB Atlas
Cache:      Redis, ioredis
Queue:      BullMQ
Auth:       JWT, OAuth 2.0, Speakeasy
Email:      Nodemailer
```

---

## ⚙️ Quick Start

```bash
git clone https://github.com/iGufrankhan/distributed-ticket-booking-system.git
cd distributed-ticket-booking-system
npm install
cp .env.example .env
# Edit .env with your credentials
npm start
```

---

## 🔑 Environment Setup

Create `.env` file:

```env
# Server
PORT=5000

# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ticket_booking

# JWT
JWT_SECRET=your_jwt_secret_key

# Gmail (for OTP)
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Redis
REDIS_HOST=your_redis_host
REDIS_PORT=6379
REDIS_USERNAME=default
REDIS_PASSWORD=your_redis_password
REDIS_DB=0

# Booking Settings
SEAT_LOCK_EXPIRY=5
PAYMENT_TIMEOUT=3
```

---

## 📚 API Documentation

### Authentication
```bash
POST /api/v1/auth/send-otp       # Send OTP
POST /api/v1/auth/register       # Signup
POST /api/v1/auth/login          # Login
GET  /api/v1/auth/google         # Google OAuth
```

### Booking
```bash
GET  /api/v1/booking/seats/:showId          # Available seats
POST /api/v1/booking/book                   # Lock seats
POST /api/v1/booking/confirm/:bookingId     # Confirm payment
POST /api/v1/booking/cancel/:bookingId      # Cancel booking
GET  /api/v1/booking/status/:bookingId      # Check status
```

### Admin
```bash
POST   /api/v1/admin/movies        # Create movie
POST   /api/v1/admin/shows         # Create show
GET    /api/v1/queue/stats         # Queue monitoring
POST   /api/v1/queue/retry/:jobId  # Retry failed job
```

Full docs: [USERWORK.MD](USERWORK.MD) | [ADMINWORK.MD](ADMINWORK.MD)

---

## 🔒 How It Works

**Booking Flow:**
1. User selects seats → Redis locks for 5 min
2. Payment initiated → BullMQ job created
3. Payment success → Seats confirmed
4. Timeout → Auto-cancel, unlock seats

**Queue System:**
- Workers monitor payments
- Auto-retry failed jobs (3 attempts)
- Admin can manually retry/clear

---

## 📁 Structure

```
src/
├── Config/          # DB, Redis
├── controllers/     # Route handlers
├── models/          # Mongoose schemas
├── services/
│   ├── booking/    # Seat locks, payments
│   └── queue/      # BullMQ workers
├── routes/         # API routes
└── middlewares/    # Auth, validation
```

---

## 🧪 Testing

Create admin user:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Test booking:
```bash
POST /api/v1/auth/login
POST /api/v1/booking/book
GET  /api/v1/booking/status/:id
```

---

## 🚀 Deployment

**Redis**: Redis Cloud (free tier)  
**MongoDB**: Atlas M0 cluster  
**Backend**: Render/Railway

⚠️ Set Redis eviction policy to `noeviction`

---

## 🤝 Contributing

PRs welcome! Fork → Branch → Commit → Push → PR

---

## 📝 License

MIT License

---

## 👨‍💻 Author

**Gufran Khan**  
[GitHub](https://github.com/iGufrankhan) • [LinkedIn](https://linkedin.com/in/gufran-khan)

---

⭐ Star if you learned something!
