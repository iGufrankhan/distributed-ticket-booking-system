# 🎟️ Distributed Ticket Booking System

A modern backend API for movie ticket booking with real-time seat locking, payment processing, and admin management. Built for reliability, speed, and a great developer experience.

---

## 🚀 Features
- Secure user auth (JWT, OAuth, 2FA)
- Admin panel for movies, venues, shows
- Smart seat locking (Redis, 5 min hold)
- Async payment queue (BullMQ)
- Auto-cancel on payment timeout
- Email notifications (booking, payment, newsletter)
- Newsletter subscription for users
- Powerful search & filter for shows
- Robust queue monitoring for admins

---

## 🛠️ Tech Stack
- **Node.js** + **Express**
- **MongoDB Atlas** (Mongoose)
- **Redis** (ioredis)
- **BullMQ** (queues)
- **Nodemailer** (email)

---

## ⚡ Quick Start
```bash
# 1. Clone & install
npm install

# 2. Configure env
cp .env.example .env
# Add your MongoDB & Redis credentials

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

Full usage: [USERWORK.MD](USERWORK.MD) | [ADMINWORK.MD](ADMINWORK.MD)

---

## 🧩 How It Works
1. **User books seats** → Redis locks seats for 5 min
2. **Payment starts** → Job added to queue
3. **Worker processes payment**
   - Success: seats confirmed, email sent
   - Timeout/fail: seats auto-released, user notified
4. **Admin** can monitor & retry jobs, send notifications/newsletters

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
- Create admin: update user role in DB
- Test booking: login → book → confirm/cancel

---

## 🌐 Deployment
- **MongoDB**: Atlas (free tier)
- **Redis**: Redis Cloud
- **Backend**: Render, Railway, or your VPS

---

## 👤 Author
[Gufran Khan](https://github.com/iGufrankhan)  
[LinkedIn](https://linkedin.com/in/gufran-khan)

---

> ⭐ If you like this project, give it a star!
