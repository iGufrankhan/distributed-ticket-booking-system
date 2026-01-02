# 🚦 ALLAPIS.md — Complete API Reference

<p align="center">
  <img src="https://img.shields.io/badge/API-Live-green?style=for-the-badge&logo=render" alt="Live API"/>
  <br/>
  <a href="https://distributed-ticket-booking-system-api.onrender.com" target="_blank"><b>🌐 https://distributed-ticket-booking-system-api.onrender.com</b></a>
</p>

> **Welcome!**  
> This is the complete, organized, and beautiful API reference for the Distributed Ticket Booking System.
>
> - 🟢 **Base URL:** Use the link above for all endpoints.
> - 📦 **Response Format:** All endpoints return `{ statusCode, data, message }`.
> - 🔑 **Auth:** Endpoints marked with "Bearer token" require a JWT in the `Authorization` header.
> - 🛡️ **Admin:** Endpoints marked with "Admin token" require admin privileges.
> - 📝 **See** [README.md](README.md) for setup, and [ALLAPIS.md](ALLAPIS.md) for this reference.
> - 💡 **Tip:** Try endpoints in Postman or your favorite API client!

---

## 🛡️ Auth APIs

### Register
- **POST** `/api/v1/auth/register`
- **Body:** `{ email, password, name }`
- **Response:** User created, email verification sent

### Login
- **POST** `/api/v1/auth/login`
- **Body:** `{ email, password }`
- **Response:** JWT token, or 2FA required

### 2FA Send OTP
- **POST** `/api/v1/auth/2fa/send`
- **Body:** `{ email }`
- **Response:** OTP sent to email

### 2FA Verify OTP
- **POST** `/api/v1/auth/2fa/verify`
- **Body:** `{ email, otp }`
- **Response:** 2FA verification success

### OAuth Login (Google/GitHub)
- **POST** `/api/v1/auth/oauth/google` or `/github`
- **Body:** `{ token }`
- **Response:** JWT token

### Password Reset
- **POST** `/api/v1/auth/reset-password`
- **Body:** `{ email }`
- **Response:** Reset link sent
- **POST** `/api/v1/auth/reset-password/confirm`
- **Body:** `{ token, newPassword }`
- **Response:** Password updated

---

## 👤 User APIs

### Get Profile
- **GET** `/api/v1/user/profile`
- **Auth:** Bearer token
- **Response:** User details

### Update Profile
- **PATCH** `/api/v1/user/profile`
- **Auth:** Bearer token
- **Body:** `{ name, ... }`
- **Response:** Updated user

### List Shows
- **GET** `/api/v1/user/shows`
- **Query:** `?movieId&city&date&genre`
- **Response:** List of shows

### Show Details
- **GET** `/api/v1/user/shows/:id`
- **Response:** Show info

### List Venues
- **GET** `/api/v1/user/venues`
- **Response:** List of venues

### Venue Details
- **GET** `/api/v1/user/venues/:id`
- **Response:** Venue info

### List Movies
- **GET** `/api/v1/user/movies`
- **Response:** List of movies

### Movie Details
- **GET** `/api/v1/user/movies/:id`
- **Response:** Movie info

### List Newsletters
- **GET** `/api/v1/user/newsletters`
- **Response:** User's newsletters

### List Notifications
- **GET** `/api/v1/user/notifications`
- **Response:** User's notifications

---

## 🎟️ Booking APIs

### Get Available Seats
- **GET** `/api/v1/booking/seats/:showId`
- **Response:** List of available seats for a show

### Book/Lock Seats
- **POST** `/api/v1/booking/book`
- **Auth:** Bearer token
- **Body:** `{ showId, seats[] }`
- **Response:** Payment info, seats locked (5 min)

### Confirm Payment/Booking
- **POST** `/api/v1/booking/confirm`
- **Auth:** Bearer token
- **Body:** `{ paymentId }`
- **Response:** Booking confirmed

### Cancel Booking
- **PATCH** `/api/v1/booking/cancel/:id`
- **Auth:** Bearer token
- **Response:** Booking cancelled, seats released

### Booking/Payment Status
- **GET** `/api/v1/booking/status/:id`
- **Auth:** Bearer token
- **Response:** Booking/payment status

### My Bookings
- **GET** `/api/v1/booking/my-bookings`
- **Auth:** Bearer token
- **Response:** List of user's bookings

---

## 📰 Newsletter APIs

### Subscribe
- **POST** `/api/v1/newsletter/subscribe`
- **Auth:** Bearer token
- **Body:** `{ email }`
- **Response:** Subscribed

### Unsubscribe
- **POST** `/api/v1/newsletter/unsubscribe`
- **Auth:** Bearer token
- **Body:** `{ email }`
- **Response:** Unsubscribed

---

## 🛡️ 2FA APIs

### Enable 2FA (Request OTP)
- **POST** `/api/2fa/enable/request`
- **Auth:** Bearer token
- **Response:** OTP sent to email

### Enable 2FA (Verify OTP)
- **POST** `/api/2fa/enable/verify`
- **Auth:** Bearer token
- **Body:** `{ otp }`
- **Response:** 2FA enabled

### Disable 2FA
- **POST** `/api/2fa/disable`
- **Auth:** Bearer token
- **Body:** `{ password }`
- **Response:** 2FA disabled

### Login with 2FA (Step 2)
- **POST** `/api/2fa/send`
- **Body:** `{ email }`
- **Response:** 2FA code sent

### Verify 2FA Code (Login)
- **POST** `/api/2fa/verify`
- **Body:** `{ email, otp }`
- **Response:** 2FA verification successful

---

## 👨‍💼 Admin APIs

### Admin Login
- **POST** `/api/v1/admin/login`
- **Body:** `{ email, password }`
- **Response:** JWT token

### Create Movie
- **POST** `/api/v1/admin/movies`
- **Auth:** Admin token
- **Body:** `{ ... }`
- **Response:** Movie created

### Create Venue
- **POST** `/api/v1/admin/venues`
- **Auth:** Admin token
- **Body:** `{ ... }`
- **Response:** Venue created

### Create Show
- **POST** `/api/v1/admin/shows`
- **Auth:** Admin token
- **Body:** `{ ... }`
- **Response:** Show created

### Queue Stats
- **GET** `/api/v1/admin/queue/stats`
- **Auth:** Admin token
- **Response:** Queue statistics

### Retry Failed Job
- **POST** `/api/v1/admin/queue/retry/:jobId`
- **Auth:** Admin token
- **Response:** Job retried

### Send Notification to All
- **POST** `/api/v1/admin/notifications/all`
- **Auth:** Admin token
- **Body:** `{ message }`
- **Response:** Notification sent

---

> For request/response examples, see the individual feature guides (2FA_GUIDE.md, BOOKINGANDPAYMENT.md, ADMINWORK.MD)
