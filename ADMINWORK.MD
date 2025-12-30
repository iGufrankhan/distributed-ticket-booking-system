# 🛠️ Admin System Documentation

## 🔐 Authentication
**Admin Login**
```
POST /api/v1/auth/login
Body: { "email": "admin@example.com", "password": "password" }
```
> **Note:** User must have `role: "admin"` in the database.

---

## 🎬 Movie Management

| Action        | Method | Endpoint                                         |
|---------------|--------|--------------------------------------------------|
| Create        | POST   | `/api/v1/admin/movies`                           |
| Get All       | GET    | `/api/v1/admin/movies?search=avengers&genre=action&isActive=true` |
| Update        | PUT    | `/api/v1/admin/movies/:movieId`                  |
| Toggle Status | PATCH  | `/api/v1/admin/movies/:movieId/toggle`           |
| Delete        | DELETE | `/api/v1/admin/movies/:movieId`                  |
| Bulk Delete   | POST   | `/api/v1/admin/movies/bulk-delete`               |

**Sample Create Movie Body**
```json
{
  "title": "Avengers",
  "language": "English",
  "duration": 180,
  "genre": "Action",
  "releaseDate": "2019-04-26"
}
```

---

## 🏢 Venue Management

| Action        | Method | Endpoint                                         |
|---------------|--------|--------------------------------------------------|
| Create        | POST   | `/api/v1/admin/venues`                           |
| Get All       | GET    | `/api/v1/admin/venues`                           |
| Get by ID     | GET    | `/api/v1/admin/venues/:venueId`                  |
| Update        | PUT    | `/api/v1/admin/venues/:venueId`                  |
| Toggle Status | PATCH  | `/api/v1/admin/venues/:venueId/toggle`           |
| Delete        | DELETE | `/api/v1/admin/venues/:venueId`                  |
| Bulk Toggle   | POST   | `/api/v1/admin/venues/bulk-toggle`               |

**Sample Create Venue Body**
```json
{
  "name": "PVR Cinemas",
  "city": "Mumbai",
  "address": "Phoenix Mall",
  "totalSeats": 200,
  "seatLayout": { "premium": 50, "regular": 150 }
}
```

---

## 🎥 Show Management

| Action        | Method | Endpoint                                         |
|---------------|--------|--------------------------------------------------|
| Create        | POST   | `/api/v1/admin/shows`                            |
| Now Playing   | GET    | `/api/v1/admin/shows/now-playing?movie=id&venue=id&date=YYYY-MM-DD` |
| Update        | PUT    | `/api/v1/admin/shows/:showId`                    |
| Cancel        | PATCH  | `/api/v1/admin/shows/:showId/cancel`             |
| Complete      | PATCH  | `/api/v1/admin/shows/:showId/complete`           |
| Delete        | DELETE | `/api/v1/admin/shows/:showId`                    |
| Bulk Cancel   | POST   | `/api/v1/admin/shows/bulk-cancel`                |

**Sample Create Show Body**
```json
{
  "movieid": "674a1b2c...",
  "venueid": "674a1b2c...",
  "showDateTime": "2025-12-25T18:00:00Z",
  "showPrice": 250,
  "totalSeats": 200
}
```

---

## 👤 User Management

| Action        | Method | Endpoint                                         |
|---------------|--------|--------------------------------------------------|
| Get All       | GET    | `/api/v1/admin/users`                            |
| Get by ID     | GET    | `/api/v1/admin/users/:userId`                    |
| Block         | PATCH  | `/api/v1/admin/users/:userId/block`              |
| Unblock       | PATCH  | `/api/v1/admin/users/:userId/unblock`            |
| Delete        | DELETE | `/api/v1/admin/users/:userId`                    |
| Bulk Block/Unblock | POST | `/api/v1/admin/users/bulk-toggle-block`       |

**Sample Bulk Toggle Body**
```json
{
  "userIds": ["id1", "id2"],
  "isBlocked": true
}
```

---

## 📊 Dashboard

| Action    | Method | Endpoint                        |
|-----------|--------|---------------------------------|
| Get Stats | GET    | `/api/v1/admin/dashboard/stats` |

**Sample Response**
```json
{
  "totalMovies": 15,
  "totalVenues": 8,
  "totalShows": 45,
  "activeShows": 30,
  "blockedUsers": 2
}
```

---

## 🔔 Notifications

| Action           | Method | Endpoint                                   |
|------------------|--------|--------------------------------------------|
| Send to All      | POST   | `/api/v1/admin/notifications/all`          |
| Send by Movie    | POST   | `/api/v1/admin/notifications/movie/:movieId`|
| Send by Venue    | POST   | `/api/v1/admin/notifications/venue/:venueId`|
| Notify New Show  | POST   | `/api/v1/admin/notifications/show/:showId` |
| Schedule         | POST   | `/api/v1/admin/notifications/schedule`     |
| Get All          | GET    | `/api/v1/admin/notifications`              |

**Sample Notification Body**
```json
{
  "title": "New Movie",
  "message": "Tickets now available!"
}
```

---

## 🔑 Authorization

All admin routes require:
- Valid JWT token
- User role: `"admin"`

**Header Example**
```
Authorization: Bearer <accessToken>
```

---

## ✅ Features

- Role-based access control
- Search & filter (movies, shows)
- Bulk operations (delete, cancel, block)
- Admin dashboard analytics
- Notification system

---

**Phase 2 Complete!** 🎉
