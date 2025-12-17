# 🎬 Distributed Ticket Booking System

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-v22.17.1-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)

**A Full-Stack Movie Ticket Booking Platform with Admin Dashboard**

[Features](#-features) • [Installation](#-installation) • [API Docs](#-api-documentation) • [Tech Stack](#-tech-stack)

</div>

---

## 📖 About The Project

A comprehensive **movie ticket booking system** similar to BookMyShow, built with Node.js and MongoDB. This platform allows users to browse movies, discover theaters, book shows, and enjoy exclusive offers while administrators manage the entire ecosystem through a powerful dashboard.

### ✨ Why This Project?

- 🎯 **Production-Ready**: Full authentication, authorization, and security features
- 🏗️ **Scalable Architecture**: MVC pattern with clean separation of concerns
- 🔐 **Secure**: JWT authentication, 2FA, OAuth integration, and password encryption
- 📱 **RESTful APIs**: 50+ well-documented endpoints
- 👨‍💼 **Admin Control**: Complete management system for movies, venues, and shows

---

## 🚀 Features

### 🔐 Authentication & Security
- ✅ Email/Password signup and login
- ✅ Two-Factor Authentication (2FA)
- ✅ OAuth integration (Google, Facebook)
- ✅ Password reset with OTP verification
- ✅ JWT-based session management
- ✅ Role-based access control (User/Admin)

### 👤 User Features
- 🎬 **Browse Movies**: Search and filter by genre, language, rating
- 🏢 **Discover Venues**: Find theaters by city and location
- 🎫 **Book Shows**: View available shows with pricing and timings
- 📦 **Order History**: Track all your bookings
- 🎁 **Offers & Deals**: Apply coupons and get discounts
- 🍽️ **Restaurant Integration**: Discover dining options near theaters
- 📺 **OTT Content**: Browse trending shows and new releases
- 👤 **Profile Management**: Update personal information

### 👨‍💼 Admin Features
- 🎬 **Movie Management**: Add, edit, delete movies with bulk operations
- 🏢 **Venue Management**: Manage theaters and screens
- 🎫 **Show Management**: Create, update, cancel shows
- 👥 **User Management**: Block/unblock users with bulk actions
- 📊 **Dashboard**: Real-time statistics and analytics
- 📢 **Notifications**: Send targeted announcements
- 🎁 **Offer Management**: Create and manage promotional campaigns

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose ODM |
| **Authentication** | JWT, OAuth 2.0, Speakeasy (2FA) |
| **Security** | bcrypt, helmet, rate limiting |
| **Email** | Nodemailer |
| **Validation** | express-validator |
| **Environment** | dotenv |

---

## 📁 Project Structure

```
distributed-ticket-booking-system/
│
├── src/
│   ├── Config/
│   │   └── dbConfig.js              # MongoDB connection
│   │
│   ├── controllers/
│   │   ├── admin/                   # Admin controllers
│   │   │   ├── movie.controllers.js
│   │   │   ├── venue.controllers.js
│   │   │   ├── show.controllers.js
│   │   │   ├── user.controllers.js
│   │   │   ├── dashboard.controllers.js
│   │   │   └── notification.controllers.js
│   │   │
│   │   ├── auth/                    # Authentication controllers
│   │   │   ├── auth.controllers.js
│   │   │   ├── 2fa.controllers.js
│   │   │   ├── outh.controllers.js
│   │   │   └── resetPassword.controllers.js
│   │   │
│   │   ├── user/                    # User controllers
│   │   │   ├── profile.controllers.js
│   │   │   ├── movie.controllers.js
│   │   │   ├── venue.controllers.js
│   │   │   ├── show.controllers.js
│   │   │   └── order.controllers.js
│   │   │
│   │   └── offersDeals/             # Offers & deals
│   │       ├── offer.controllers.js
│   │       ├── resturants.controllers.js
│   │       └── ott.constrollers.js
│   │
│   ├── models/                      # MongoDB schemas
│   │   ├── user.models.js
│   │   ├── movie.models.js
│   │   ├── venue.models.js
│   │   ├── show.models.js
│   │   ├── order.models.js
│   │   ├── offer.models.js
│   │   ├── restaurant.models.js
│   │   ├── ott.models.js
│   │   ├── notification.models.js
│   │   └── otp.models.js
│   │
│   ├── routes/                      # API routes
│   │   ├── authRoutes/
│   │   ├── admin/
│   │   └── userworkRoutes/
│   │
│   ├── middlewares/                 # Custom middlewares
│   │   ├── auth/
│   │   └── limiterandverify/
│   │
│   ├── services/                    # Business logic
│   │   ├── auth/
│   │   └── events/
│   │
│   └── lib/                         # Helper functions
│
├── utils/                           # Utility functions
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── AsyncHandler.js
│   ├── emailservices/
│   └── validators/
│
├── app.js                           # Express app setup
├── index.js                         # Server entry point
├── package.json
└── .env                            # Environment variables
```

---

## ⚙️ Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/distributed-ticket-booking-system.git
cd distributed-ticket-booking-system
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
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

# Email Configuration (for OTP and notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# OAuth (Google)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# OAuth (Facebook)
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/v1/auth/facebook/callback

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Step 4: Start the Server
```bash
npm start
```

The server will start at `http://localhost:5000` 🚀

---

## 🔑 Environment Variables Explained

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | ✅ |
| `MONGO_URI` | MongoDB connection string | ✅ |
| `JWT_SECRET` | Secret key for JWT tokens | ✅ |
| `EMAIL_USER` | Email for sending OTPs | ✅ |
| `EMAIL_PASSWORD` | Email app password | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ❌ |
| `FACEBOOK_APP_ID` | Facebook OAuth app ID | ❌ |

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### 🔐 Authentication Routes
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `POST /auth/forgot-password` - Send password reset OTP
- `POST /auth/reset-password` - Reset password with OTP
- `POST /auth/2fa/enable` - Enable 2FA
- `POST /auth/2fa/verify` - Verify 2FA code
- `GET /auth/google` - Google OAuth login
- `GET /auth/facebook` - Facebook OAuth login

### 👤 User Routes
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update profile
- `DELETE /user/profile` - Delete account
- `GET /user/movies` - Browse movies
- `GET /user/venues` - Browse venues
- `GET /user/shows` - View available shows
- `GET /user/orders` - Order history
- `GET /user/offers` - View offers
- `POST /user/offers/:id/use` - Apply coupon

### 👨‍💼 Admin Routes (Protected)
- `POST /admin/movies` - Add movie
- `PUT /admin/movies/:id` - Update movie
- `DELETE /admin/movies/:id` - Delete movie
- `POST /admin/movies/bulk-delete` - Bulk delete movies
- `POST /admin/venues` - Add venue
- `POST /admin/shows` - Create show
- `GET /admin/dashboard` - Dashboard stats
- `POST /admin/notifications` - Send notifications

**📖 Complete API Documentation:** [userwork.md](userwork.md)

---

## 🗄️ Database Models

### User Model
```javascript
{
  username: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: ["user", "admin"],
  isBlocked: Boolean,
  twoFactorSecret: String,
  isTwoFactorEnabled: Boolean
}
```

### Movie Model
```javascript
{
  title: String,
  description: String,
  genre: [String],
  language: String,
  duration: Number,
  rating: Number,
  releaseDate: Date,
  cast: [String],
  director: String,
  poster: String,
  trailer: String,
  isActive: Boolean
}
```

### Show Model
```javascript
{
  movie: ObjectId (ref: Movie),
  venue: ObjectId (ref: Venue),
  showTime: Date,
  price: Number,
  totalSeats: Number,
  availableSeats: Number,
  bookedSeats: [String],
  status: ["upcoming", "completed", "cancelled"]
}
```

### Order Model
```javascript
{
  user: ObjectId (ref: User),
  movie: ObjectId (ref: Movie),
  show: ObjectId (ref: Show),
  theatre: ObjectId (ref: Venue),
  seats: [{ seatNumber, row, price }],
  totalAmount: Number,
  paymentStatus: ["PENDING", "SUCCESS", "FAILED"],
  bookingStatus: ["CONFIRMED", "CANCELLED"],
  orderId: String (unique)
}
```

---

## 🎯 Key Features Explained

### 🔐 Two-Factor Authentication (2FA)
Users can enable 2FA for enhanced security. The system generates a QR code using Speakeasy that can be scanned with Google Authenticator or similar apps.

### 🎁 Coupon System
- **Percentage Discounts**: Get X% off
- **Flat Discounts**: Get ₹X off
- **Minimum Order Amount**: Coupon valid above certain amount
- **Max Discount Cap**: Limit maximum discount
- **Usage Tracking**: Track how many times a coupon is used

### 📊 Admin Dashboard
Real-time statistics including:
- Total movies, venues, shows
- Active shows count
- Blocked users count
- Revenue metrics

### 📢 Notification System
Admins can send targeted notifications:
- To all users
- To users who watched a specific movie
- To users in a specific venue
- Scheduled notifications

---

## 🔒 Security Features

- ✅ **Password Hashing**: bcrypt with salt rounds
- ✅ **JWT Tokens**: Secure session management
- ✅ **Rate Limiting**: Prevent brute force attacks
- ✅ **Input Validation**: express-validator for all inputs
- ✅ **CORS**: Configured for frontend integration
- ✅ **Helmet**: Security headers
- ✅ **2FA**: Optional two-factor authentication
- ✅ **Role-Based Access**: Admin vs User permissions

---

## 🧪 Testing the API

### Using Postman

1. **Import Collection**: Create a new collection in Postman
2. **Set Base URL**: `http://localhost:5000/api/v1`
3. **Test Authentication**:
   ```
   POST /auth/signup
   Body: {
     "email": "test@example.com",
     "password": "Test@123",
     "username": "testuser"
   }
   ```
4. **Get Token**: Copy the JWT token from login response
5. **Test Protected Routes**: Add token to Authorization header
   ```
   Authorization: Bearer your_jwt_token_here
   ```

### Sample API Calls

**Register User**:
```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Secure@123",
    "username": "johndoe"
  }'
```

**Browse Movies**:
```bash
curl http://localhost:5000/api/v1/user/movies?genre=Action&language=English
```

---

## 🚧 Roadmap

### Current Features ✅
- [x] Authentication & Authorization
- [x] Movie, Venue, Show Management
- [x] User Profile & Orders
- [x] Offers & Coupons
- [x] Restaurant & OTT Integration
- [x] Admin Dashboard
- [x] Notifications

### Upcoming Features 🚀
- [ ] Payment Gateway Integration (Razorpay/Stripe)
- [ ] Seat Selection UI
- [ ] Real-time Seat Availability (WebSocket)
- [ ] Email Tickets (PDF generation)
- [ ] Review & Rating System
- [ ] Recommendation Engine (AI-based)
- [ ] Mobile App (React Native)
- [ ] Multi-language Support
- [ ] Analytics Dashboard
- [ ] Refund Management

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the Project**
2. **Create Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit Changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to Branch** (`git push origin feature/AmazingFeature`)
5. **Open Pull Request**

---

## 📝 License

Distributed under the MIT License. See `LICENSE` file for more information.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [JWT](https://jwt.io/)
- [Nodemailer](https://nodemailer.com/)
- Inspired by [BookMyShow](https://bookmyshow.com)

---

## 📞 Support

If you have any questions or need help, feel free to:
- Open an issue on GitHub
- Email me at your.email@example.com
- Connect on LinkedIn

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [GUFRAN KHAN]

</div>
