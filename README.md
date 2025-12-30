# 🎬✨ Distributed Ticket Booking System

![Node.js](https://img.shields.io/badge/Node.js-v22.17.1-green)
![Express](https://img.shields.io/badge/Express-5.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![Redis](https://img.shields.io/badge/Redis-Queue-red)

---

A modern, production-ready backend API for movie ticket booking. Enjoy real-time seat locking, async payment processing, admin dashboards, and user notifications—all built for reliability, scalability, and a great developer experience.

---

## 🚀 Features

- 🔐 Secure user authentication (JWT, OAuth, 2FA)
- 🎬 Admin management for movies, venues, and shows
- 🪑 Real-time seat locking with Redis (no double-booking!)
- 💸 Async payment processing with BullMQ
- ⏰ Auto-cancel & seat release on payment timeout
- 📧 Email notifications (booking, payment, newsletters)
- 📰 Newsletter subscription & delivery
- 🔎 Powerful search & filter for shows
- 🛠️ Admin queue monitoring & notification tools

---

## 🛠️ Tech Stack

- **Node.js** & **Express**
- **MongoDB Atlas** (Mongoose)
- **Redis** (ioredis)
- **BullMQ** (job queues)
- **Nodemailer** (email)

---

## ⚡ Quick Start

```bash
# 1. Clone & install dependencies
git clone https://github.com/yourusername/distributed-ticket-booking-system.git
cd distributed-ticket-booking-system
npm install

# 2. Configure environment variables
cp .env.example .env
# Fill in your MongoDB, Redis, and email credentials

# 3. Start servers
npm start         # API server
npm run worker    # Payment worker
```

---

## 📚 API Highlights
- **/api/v1/auth/** — Register, login, 2FA, OAuth
- **/api/v1/booking/** — Book, confirm, cancel, status
- **/api/v1/admin/** — Movies, venues, shows, queue, notifications
- **/api/v1/newsletter/** — Subscribe/unsubscribe

See [USERWORK.MD](USERWORK.MD) and [ADMINWORK.MD](ADMINWORK.MD) for full API usage.

---

## 🧩 How It Works

```mermaid
flowchart TD
    A[User books seats] --> B[Redis locks seats (5 min)]
    B --> C[Payment job queued]
    C --> D[Worker processes payment]
    D -->|Success| E[Seats confirmed, user emailed]
    D -->|Timeout/Fail| F[Seats auto-released, user notified]
    E & F --> G[Admin can monitor/retry jobs, send notifications/newsletters]
```

---

## 🗂️ Project Structure

```
src/
  controllers/   # API logic
  models/        # Schemas
  services/      # Core logic (locks, queue, email)
  workers/       # Payment processor
  routes/        # API routes
```

---

## 📝 Testing
- Create admin: update user role in MongoDB
- Test booking: login → book → confirm/cancel

---

## 🌐 Deployment
- **MongoDB**: Atlas (free tier)
- **Redis**: Redis Cloud (free)
- **Backend**: Render, Railway, or your VPS

---

## 👤 Author
[Gufran Khan](https://github.com/iGufrankhan)  
[LinkedIn](https://linkedin.com/in/gufran-khan)

---

> ⭐ **Star this repo if you found it helpful!**
