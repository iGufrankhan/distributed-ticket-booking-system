# 🎬✨ Distributed Ticket Booking System
<p align="center">
   <a href="https://distributed-ticket-booking-system-api.onrender.com" target="_blank">
      <img src="https://img.shields.io/badge/Live%20Demo-Online-brightgreen?style=for-the-badge&logo=render" alt="Live Demo"/>
   </a>
</p>

<p align="center">
   <b>🌐 <a href="https://distributed-ticket-booking-system-api.onrender.com" target="_blank">View the API Live on Render</a></b>
</p>

![Node.js](https://img.shields.io/badge/Node.js-v22.17.1-green)
![Express](https://img.shields.io/badge/Express-5.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)

---

A modern, production-ready backend API for movie ticket booking. Enjoy real-time seat locking, async payment processing, admin dashboards, and user notifications—all built for reliability, scalability, and a great developer experience.

---

## 🌟 All Features at a Glance

- 🔐 **Authentication**: JWT, OAuth (Google/GitHub), 2FA (OTP/TOTP), password reset, email verification
- 👤 **User Management**: Register, login, profile, secure sessions
- 🎬 **Admin Panel**: Manage movies, venues, shows, users, and bookings
- 🪑 **Seat Locking**: Real-time, atomic seat locks with Redis (5 min hold)
- 🎟️ **Booking System**: Book, confirm, cancel, and view bookings
- 💸 **Payment Queue**: Async payment processing with BullMQ, auto-timeout, retries, and failure handling
- ⏰ **Auto-Cancellation**: Bookings auto-cancelled and seats released if payment not completed in time
- 📧 **Email Notifications**: Booking confirmation, payment status, admin/user notifications
- 📰 **Newsletter**: User subscribe/unsubscribe, admin send newsletters, confirmation emails
- 🔎 **Search & Filter**: Find shows by movie, city, date, genre, venue
- 🛠️ **Admin Tools**: Queue monitoring, retry/clean jobs, send notifications, analytics endpoints
- 📊 **Dashboard Ready**: All endpoints for building admin/user dashboards
- 🧑‍💻 **Role-Based Access**: Secure admin/user separation
- 🧪 **Testing Ready**: Easy to test all flows (auth, booking, payment, admin)
- 🌐 **Deployment Ready**: Works on Render, Railway, or any VPS

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

## 🏗️ Local Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/distributed-ticket-booking-system.git
   cd distributed-ticket-booking-system
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set up environment variables**
   - Copy the example file and fill in your credentials:
     ```bash
     cp .env.example .env
     # Edit .env with your MongoDB, Redis, and email credentials
     ```
4. **Start MongoDB and Redis**
   - You can use [MongoDB Atlas](https://www.mongodb.com/atlas/database) and [Redis Cloud](https://redis.com/redis-enterprise-cloud/overview/) for free cloud databases, or run them locally if you prefer.
5. **Start the API server**
   ```bash
   npm start
   # Runs on http://localhost:5000
   ```
6. **Start the payment worker**
   ```bash
   npm run worker
   # Processes payment jobs in the background
   ```

---

## 📚 API Highlights
- **/api/v1/auth/** — Register, login, 2FA, OAuth
- **/api/v1/booking/** — Book, confirm, cancel, status
- **/api/v1/admin/** — Movies, venues, shows, queue, notifications
- **/api/v1/newsletter/** — Subscribe/unsubscribe

---

## 🧩 How It Works

```
flowchart TD
    A[User books seats] --> B[Redis locks seats (5 min)]
    B --> C[Payment job queued]
    C --> D[Worker processes payment]
    D -->|Success| E[Seats confirmed, user emailed]
    D -->|Timeout/Fail| F[Seats auto-released, user notified]
    E & F --> G[Admin can monitor/retry jobs, send notifications/newsletters]
```

---

## 📁 Folder Structure

```
distributed-ticket-booking-system/
│
├── src/
│   ├── controllers/    # Route logic (auth, admin, booking, user, newsletter)
│   ├── models/         # MongoDB schemas (User, Movie, Venue, Show, Booking, Payment, Seat, Notification)
│   ├── services/       # Core logic (seat lock, queue, email, newsletter)
│   ├── workers/        # Payment processor (BullMQ)
│   └── middlewares/    # Auth, validation, rate limiting
│
├── utils/              # Helpers, constants, email setup
├── package.json        # Dependencies & scripts
├── ALLAPIS.md          # Complete API reference (all endpoints)
└── README.md           # Project docs
```
### 👤 Admin
- `POST   /api/v1/admin/movies`          — Create movie
- `POST   /api/v1/admin/venues`          — Create venue
- `POST   /api/v1/admin/shows`           — Create show
- `GET    /api/v1/admin/queue/stats`     — Queue stats
- `POST   /api/v1/admin/queue/retry/:jobId` — Retry failed job
- `POST   /api/v1/booking/confirm`       — Confirm payment
- `GET    /api/v1/booking/status/:id`    — Booking/payment status
- `GET    /api/v1/booking/my-bookings`   — User's bookings

### 📰 Newsletter
- `POST   /api/v1/newsletter/subscribe`   — Subscribe to newsletter
- `POST   /api/v1/newsletter/unsubscribe` — Unsubscribe from newsletter

### 🙋‍♂️ User
- `GET    /api/v1/user/profile`           — Get user profile
- `PATCH  /api/v1/user/profile`           — Update user profile
- `GET    /api/v1/user/shows`             — List all shows (with filters)
- `GET    /api/v1/user/shows/:id`         — Get show details
- `GET    /api/v1/user/venues`            — List all venues
- `GET    /api/v1/user/venues/:id`        — Get venue details
- `GET    /api/v1/user/movies`            — List all movies
- `GET    /api/v1/user/movies/:id`        — Get movie details
- `GET    /api/v1/user/newsletters`       — List received newsletters
- `GET    /api/v1/user/notifications`     — List user notifications

---

## 📖 Documentation

- 📚 **API Reference:**
   - See [ALLAPIS.md](ALLAPIS.md) for a complete list and details of all API endpoints.
- 🔑 **Authentication:**
   - See [AUTH.md](AUTH.md) for registration, login, 2FA, OAuth, and password reset flows.
- 🎟️ **Booking:**
   - See [BOOKINGANDPAYMENT.md](BOOKINGANDPAYMENT.md) for booking, payment, seat locking, and user booking management.
- 🛡️ **Admin:**
   - See [ADMINWORK.md](ADMINWORK.md) for all admin features, endpoints, and dashboard actions.

---

## 👥 What Can Users Do?

- Register and log in securely (email/password, Google, GitHub)
- Enable 2FA for extra security
- Browse movies, venues, and shows
- Search and filter shows by city, date, genre, or movie
- Book seats (with real-time locking)
- Complete payment and receive confirmation
- View, confirm, or cancel their bookings
- Subscribe/unsubscribe to newsletters
- Receive email notifications for bookings, payments, and newsletters

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

---

> ⭐ **Star this repo if you found it helpful!**
