# 🎬 Distributed Ticket Booking System

A movie ticket booking API with Redis seat locking, payment queues, and concurrent booking handling.

[![Node.js](https://img.shields.io/badge/Node.js-v22.17.1-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-blue)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-Queue-red)](https://redis.io/)

---

## 📖 About

Backend for ticket bookings with seat locking, payment processing, and auto-cancellation. Prevents double-booking using Redis and handles payment timeouts with Bull queues.

---

## ✨ Features

**Phase 1: Authentication**
- Email/Password login with JWT
- OAuth (Google & GitHub)
- 2FA (Email OTP + TOTP)
- Password reset flow

**Phase 2: Admin System**
- Movie & theater management
- Show scheduling
- Role-based access control

**Phase 3: Smart Booking**
- Redis seat locks (5 min timeout)
- Background payment processing
- Auto-cancellation on timeout
- Queue monitoring dashboard

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
cp [.env.example](http://_vscodecontentref_/0) .env
# Add your MongoDB, Redis credentials
npm start          # API server
npm run worker     # Payment worker
```

---

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
├── controllers/    # Route logic
├── models/         # MongoDB schemas
├── services/       # Seat locks, queue
├── workers/        # Payment processor
└── routes/         # API routes
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
