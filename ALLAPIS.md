# API Reference (Current)

Base URL: `https://distributed-ticket-booking-system-api.onrender.com`

Versioned prefix used by the app: `/api/v1`

## Health
- `GET /`

## Auth (`/api/v1/auth`)
- `POST /send-otp`
- `POST /verify-otp`
- `POST /register`
- `POST /login`
- `POST /resend-otp`
- `POST /change-password` (auth required)
- `POST /logout`
- `POST /refresh-token`
- `GET /me` (auth required)
- `POST /forgot-password`
- `POST /reset-password`

### OAuth callbacks under same auth prefix
- `GET /google/callback`
- `GET /github/callback`

## 2FA (`/api/v1/2fa`)
- `POST /enable/request` (auth required)
- `POST /enable/verify` (auth required)
- `POST /disable` (auth required)
- `POST /verify`

## User (`/api/v1/user`)
### Profile
- `GET /profile` (auth required)
- `PUT /profile` (auth required)
- `DELETE /profile` (auth required)

### Movies
- `GET /movies`
- `GET /movies/search`
- `GET /movies/:movieId`

### Venues
- `GET /venues`
- `GET /venues/search`
- `GET /venues/city/:city`
- `GET /venues/:venueId`

### Shows
- `GET /shows`
- `GET /shows/filter`
- `GET /shows/movie/:movieId`
- `GET /shows/:showId`

### Orders
- `GET /orders` (auth required)
- `GET /orders/:orderId` (auth required)

### Offers / Restaurants / OTT
- `GET /offers`
- `GET /offers/trending`
- `GET /offers/category/:category`
- `GET /offers/:offerId`
- `POST /offers/:offerId/use` (auth required)
- `GET /restaurants`
- `GET /restaurants/top-rated`
- `GET /restaurants/city/:city`
- `GET /restaurants/:restaurantId`
- `GET /ott`
- `GET /ott/trending`
- `GET /ott/new-releases`
- `GET /ott/recommended`
- `GET /ott/platform/:platform`
- `GET /ott/:ottId`

## Bookings (`/api/v1/bookings`) (all auth required)
- `POST /book`
- `POST /confirm`
- `GET /status/:bookingId`
- `GET /my-bookings`
- `PATCH /cancel/:bookingId`

## Admin (`/api/v1/admin`) (all require admin)
- Movies: `POST/GET /movies`, `GET/PATCH/DELETE /movies/:id`
- Venues: `POST/GET /venues`, `GET/PATCH/DELETE /venues/:id`
- Shows: `POST /shows`, `PUT/DELETE /shows/:showId`, `GET /shows/now-playing`, `PATCH /shows/:showId/cancel`, `PATCH /shows/:showId/complete`, `POST /shows/bulk-cancel`
- Queue monitoring: `GET /queue/stats`, `GET /queue/health`, `GET /queue/failed`, `GET /queue/active`, `GET /queue/waiting`, `GET /queue/completed`, `GET /queue/job/:jobId`
- Queue management: `POST /queue/retry/:jobId`, `POST /queue/retry-all`, `DELETE /queue/job/:jobId`, `POST /queue/clean`, `POST /queue/pause`, `POST /queue/resume`, `DELETE /queue/empty`
- Notifications: `POST /notifications/all`, `POST /notifications/movie/:movieId`, `POST /notifications/venue/:venueId`, `POST /notifications/show/:showId`, `POST /notifications/schedule`, `GET /notifications`
- Newsletter: `POST /newsletter/send`
- Seats: `POST /seats`, `GET /seats/:showId`

## Auth Header
`Authorization: Bearer <accessToken>`
