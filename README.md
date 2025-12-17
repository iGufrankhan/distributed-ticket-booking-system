# 🎬 Distributed Ticket Booking System

> A production-ready movie ticket booking REST API similar to BookMyShow - built with Node.js, Express, and MongoDB

[![Node.js](https://img.shields.io/badge/Node.js-v22.17.1-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-blue)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## 📖 About

A **complete backend system** for movie ticket booking with advanced features including multi-factor authentication, OAuth integration, role-based access control, and real-time notifications. Users can browse movies, discover theaters, book shows, and redeem offers while admins manage the entire platform through comprehensive APIs.

**🎯 Perfect for:**
- Backend portfolio projects
- Learning production-grade Node.js architecture
- Understanding complex authentication flows
- Building scalable REST APIs

---

## ✨ Key Features

### 🔐 Authentication & Security
- **Multi-factor Authentication**: Email OTP + 2FA verification
- **OAuth Integration**: Google & GitHub login
- **JWT Sessions**: Secure token-based authentication
- **Password Security**: bcrypt hashing with salt
- **Rate Limiting**: OTP & login rate limiting
- **Email Verification**: Required before login
- **Password Reset**: OTP-based password recovery

### 👤 User Features
- Browse movies with filters (genre, language, rating)
- Discover theaters by city and location
- View available shows with real-time pricing
- Order history and booking management
- Apply promotional coupons and offers
- Restaurant and OTT content recommendations
- Profile management

### 👨‍💼 Admin Features
- Complete CRUD for movies, venues, and shows
- Bulk operations (delete movies, toggle venues, cancel shows)
- User management (block/unblock with restrictions)
- Real-time dashboard with analytics
- Targeted notifications (all users, movie watchers, venue visitors)
- Offer and coupon management with usage tracking

---

## 🛠️ Tech Stack

```
Backend:        Node.js, Express.js
Database:       MongoDB, Mongoose ODM
Authentication: JWT, OAuth 2.0, Speakeasy (2FA)
Email:          Nodemailer
Validation:     Joi, express-validator
Security:       bcrypt, express-rate-limit
Queue:          BullMQ, Redis
```

---

## 📁 Project Structure

```
distributed-ticket-booking-system/
├── src/
│   ├── Config/              # Database configuration
│   ├── controllers/
│   │   ├── admin/           # Admin CRUD operations
│   │   ├── auth/            # Authentication flows
│   │   ├── user/            # User operations
│   │   └── offersDeals/     # Offers, restaurants, OTT
│   ├── models/              # 10 Mongoose schemas
│   ├── routes/              # Express route handlers
│   ├── middlewares/         # Auth, rate limiting, validation
│   ├── services/            # Business logic
│   └── lib/                 # Helper functions
├── utils/                   # Shared utilities
├── app.js                   # Express app setup
├── index.js                 # Server entry point
├── USERWORK.MD             # User API documentation
├── ADMINWORK.MD            # Admin API documentation
├── AUTH_DETAILS.md         # Complete auth guide
└── 2FA_GUIDE.md            # 2FA implementation guide
```

**Models (10):** User, Movie, Venue, Show, Order, Offer, Restaurant, OTT, Notification, OTP

---

## ⚙️ Quick Start

### Prerequisites
- Node.js v14+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/iGufrankhan/distributed-ticket-booking-system.git
cd distributed-ticket-booking-system

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start server
npm start
```

Server runs at `http://localhost:5000` 🚀

---

## 🔑 Environment Setup

Create `.env` file in root directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string
DB_NAME=ticket_booking

# JWT Secrets
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_EXPIRY=7d
REFRESH_TOKEN_EXPIRY=30d

# Email Configuration (Gmail for OTP/notifications)
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password

# OAuth - Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# OAuth - GitHub
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

OAUTH_REDIRECT_URL=http://localhost:5000/api/auth
```

**📧 Gmail Setup:** Enable 2-step verification and create an [App Password](https://support.google.com/accounts/answer/185833)

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Quick Reference

**Authentication:** See [AUTH_DETAILS.md](AUTH_DETAILS.md) for complete auth flows  
**User APIs:** See [USERWORK.MD](USERWORK.MD) for all user endpoints  
**Admin APIs:** See [ADMINWORK.MD](ADMINWORK.MD) for all admin endpoints  
**2FA Guide:** See [2FA_GUIDE.md](2FA_GUIDE.md) for two-factor authentication

### Main Endpoints

```bash
# Health Check
GET /

# Authentication
POST /api/v1/auth/send-otp              # Step 1: Send signup OTP
POST /api/v1/auth/verify-otp            # Step 2: Verify OTP
POST /api/v1/auth/register              # Step 3: Complete signup
POST /api/v1/auth/login                 # Login
POST /api/v1/auth/logout                # Logout
POST /api/v1/auth/resend-otp            # Resend OTP
POST /api/v1/auth/change-password       # Change password
POST /api/v1/auth/forgot-password       # Forgot password OTP
POST /api/v1/auth/reset-password        # Reset password
GET  /api/v1/auth/google/callback       # Google OAuth
GET  /api/v1/auth/github/callback       # GitHub OAuth

# 2FA
POST /api/v1/2fa/enable/request         # Request 2FA enable
POST /api/v1/2fa/enable/verify          # Verify and enable 2FA
POST /api/v1/2fa/disable                # Disable 2FA
POST /api/v1/2fa/verify-login           # Verify 2FA on login

# User Operations (Protected)
GET  /api/v1/user/profile               # Get profile
PUT  /api/v1/user/profile               # Update profile
GET  /api/v1/user/movies                # Browse movies
GET  /api/v1/user/venues                # Browse theaters
GET  /api/v1/user/shows                 # View shows
GET  /api/v1/user/orders                # Order history
GET  /api/v1/user/offers                # Get offers
POST /api/v1/user/offers/:id/use        # Apply coupon

# Admin Operations (Admin Only)
GET    /api/v1/admin/dashboard/stats    # Dashboard
POST   /api/v1/admin/movies             # Create movie
PUT    /api/v1/admin/movies/:id         # Update movie
DELETE /api/v1/admin/movies/:id         # Delete movie
POST   /api/v1/admin/movies/bulk-delete # Bulk delete
POST   /api/v1/admin/shows              # Create show
PATCH  /api/v1/admin/shows/:id/cancel   # Cancel show
POST   /api/v1/admin/venues             # Create venue
PATCH  /api/v1/admin/users/:id/block    # Block user
POST   /api/v1/admin/notifications/send-all  # Send notification
```

### Response Format

**Success:**
```json
{
  "statusCode": 200,
  "data": { /* response data */ },
  "message": "Success message",
  "success": true
}
```

**Error:**
```json
{
  "statusCode": 400,
  "data": null,
  "message": "Error message",
  "success": false,
  "errors": []
}
```

---

## 🗄️ Database Models

**10 Mongoose Schemas:**

```javascript
User: username, email, password, role, isBlocked, twoFactorSecret
Movie: title, genre, language, duration, rating, cast, director, isActive
Venue: name, city, address, screens, location, amenities
Show: movie, venue, showTime, price, seats, bookedSeats, status
Order: user, movie, show, seats, totalAmount, paymentStatus, orderId
Offer: title, category, discountType, couponCode, validFrom, validTill
Restaurant: name, city, cuisine, rating, offers
OTT: title, platform, genre, rating, releaseYear
Notification: title, message, targetAudience, sentAt
OTP: email, otp, expiresAt, isVerified
```

---

## 🔒 Security

- **bcrypt** password hashing with salt
- **JWT** access & refresh tokens
- **Rate limiting** on auth endpoints
- **2FA** with email OTP
- **OAuth 2.0** (Google, Facebook)
- **Input validation** (Joi, express-validator)
- **Role-based access control**
- **Account lockout** after failed attempts
- **Email verification** required

---

---

## 🧪 Testing

### Using Postman/Thunder Client

1. Import collection or test endpoints manually
2. Set base URL: `http://localhost:5000/api/v1`
3. **Auth Flow:**
   ```
   POST /auth/send-otp        → Get OTP in email
   POST /auth/signup          → Register with OTP
   POST /auth/login           → Get JWT token
   ```
4. **Protected Routes:** Add token to headers
   ```
   Authorization: Bearer your_jwt_token
   ```
5. **Admin Routes:** Login as admin to test admin APIs

### Create Admin User

```javascript
// Connect to MongoDB and run:
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

---

## 🚀 Deployment

**Recommended Platforms:**
- **Backend:** Render, Railway, Heroku
- **Database:** MongoDB Atlas (free tier)

**Pre-deployment:**
- Set all environment variables
- Update CORS origins
- Change NODE_ENV to `production`

---

## 🤝 Contributing

Contributions welcome! 

1. Fork the repository
2. Create feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Open Pull Request

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file

---

## 👨‍💻 Author

**GUFRAN KHAN**
- GitHub: [@iGufrankhan](https://github.com/iGufrankhan)
- LinkedIn: [Gufran Khan](https://linkedin.com/in/gufran-khan)

---

## 🙏 Acknowledgments

Built with: Express.js • MongoDB • JWT • Nodemailer  
Inspired by: BookMyShow

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ for backend developers

</div>
