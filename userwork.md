# User API Documentation

Base URL: `http://localhost:5000/api/v1/user`

All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📱 User Profile Management

### Get User Profile
```http
GET /api/v1/user/profile
```
**Auth Required:** Yes

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "createdAt": "2025-12-17T10:00:00.000Z"
  },
  "message": "Profile fetched successfully"
}
```

### Update User Profile
```http
PUT /api/v1/user/profile
```
**Auth Required:** Yes

**Body:**
```json
{
  "username": "new_username",
  "phone": "9876543210"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "username": "new_username",
    "email": "john@example.com",
    "phone": "9876543210"
  },
  "message": "Profile updated successfully"
}
```

### Delete User Account
```http
DELETE /api/v1/user/profile
```
**Auth Required:** Yes

**Response:**
```json
{
  "statusCode": 200,
  "data": null,
  "message": "Account deleted successfully"
}
```

---

## 🎬 Movie Browsing

### Get All Movies
```http
GET /api/v1/user/movies
```
**Auth Required:** No

**Query Parameters:**
- `search` - Search by movie title
- `genre` - Filter by genre
- `language` - Filter by language
- `isActive` - Filter active movies (true/false)

**Example:**
```http
GET /api/v1/user/movies?genre=Action&language=English&search=Avengers
```

**Response:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "movie_id",
      "title": "Avengers: Endgame",
      "genre": ["Action", "Adventure"],
      "language": "English",
      "duration": 181,
      "rating": 8.4,
      "releaseDate": "2025-04-26",
      "poster": "poster_url",
      "isActive": true
    }
  ],
  "message": "Movies fetched successfully"
}
```

### Get Movie by ID
```http
GET /api/v1/user/movies/:id
```
**Auth Required:** No

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "movie_id",
    "title": "Avengers: Endgame",
    "description": "Movie description...",
    "genre": ["Action", "Adventure"],
    "language": "English",
    "duration": 181,
    "rating": 8.4,
    "cast": ["Robert Downey Jr.", "Chris Evans"],
    "director": "Russo Brothers",
    "releaseDate": "2025-04-26",
    "poster": "poster_url",
    "trailer": "trailer_url"
  },
  "message": "Movie details fetched successfully"
}
```

### Search Movies
```http
GET /api/v1/user/movies/search?q=avengers
```
**Auth Required:** No

**Response:** Same as Get All Movies

---

## 🏢 Venue/Theatre Browsing

### Get All Venues
```http
GET /api/v1/user/venues
```
**Auth Required:** No

**Query Parameters:**
- `city` - Filter by city
- `search` - Search by venue name

**Example:**
```http
GET /api/v1/user/venues?city=Mumbai&search=INOX
```

**Response:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "venue_id",
      "name": "INOX Megaplex",
      "city": "Mumbai",
      "address": "Andheri West, Mumbai",
      "screens": 8,
      "amenities": ["Parking", "Food Court", "3D"],
      "isActive": true
    }
  ],
  "message": "Venues fetched successfully"
}
```

### Get Venue by ID
```http
GET /api/v1/user/venues/:id
```
**Auth Required:** No

### Get Venues by City
```http
GET /api/v1/user/venues/city/:cityName
```
**Auth Required:** No

**Example:**
```http
GET /api/v1/user/venues/city/Mumbai
```

---

## 🎫 Show Discovery

### Get All Shows
```http
GET /api/v1/user/shows
```
**Auth Required:** No

**Query Parameters:**
- `movie` - Filter by movie ID
- `venue` - Filter by venue ID
- `city` - Filter by city
- `date` - Filter by date (YYYY-MM-DD)
- `status` - Filter by status (upcoming/completed/cancelled)

**Example:**
```http
GET /api/v1/user/shows?city=Mumbai&date=2025-12-20&movie=movie_id
```

**Response:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "show_id",
      "movie": {
        "_id": "movie_id",
        "title": "Avengers: Endgame",
        "poster": "poster_url"
      },
      "venue": {
        "_id": "venue_id",
        "name": "INOX Megaplex",
        "city": "Mumbai"
      },
      "showTime": "2025-12-20T18:30:00.000Z",
      "price": 250,
      "availableSeats": 120,
      "totalSeats": 150,
      "status": "upcoming"
    }
  ],
  "message": "Shows fetched successfully"
}
```

### Get Show by ID
```http
GET /api/v1/user/shows/:id
```
**Auth Required:** No

### Get Shows by Venue and City
```http
GET /api/v1/user/shows/venue/:venueId/city/:cityName
```
**Auth Required:** No

### Get Shows by Movie
```http
GET /api/v1/user/shows/movie/:movieId
```
**Auth Required:** No

---

## 📦 Order History

### Get My Orders
```http
GET /api/v1/user/orders
```
**Auth Required:** Yes

**Response:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "order_id",
      "orderId": "ORD123456",
      "movie": {
        "title": "Avengers: Endgame",
        "poster": "poster_url"
      },
      "theatre": {
        "name": "INOX Megaplex"
      },
      "show": {
        "showTime": "2025-12-20T18:30:00.000Z"
      },
      "seats": [
        {
          "seatNumber": "A1",
          "row": "A",
          "price": 250
        }
      ],
      "totalAmount": 250,
      "paymentStatus": "SUCCESS",
      "bookingStatus": "CONFIRMED",
      "bookingTime": "2025-12-17T10:00:00.000Z"
    }
  ],
  "message": "Orders fetched successfully"
}
```

---

## 🎁 Offers & Deals

### Get All Offers
```http
GET /api/v1/user/offers
```
**Auth Required:** No

**Query Parameters:**
- `category` - Filter by category (movies/food/events/shopping/travel)
- `offerType` - Filter by type (MOVIE/RESTAURANT/OTT)
- `isActive` - Filter active offers (true/false)
- `search` - Search offers

**Example:**
```http
GET /api/v1/user/offers?category=movies&isActive=true
```

**Response:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "offer_id",
      "title": "50% Off on Movie Tickets",
      "description": "Get 50% discount on all movies",
      "category": "movies",
      "offerType": "MOVIE",
      "discountType": "PERCENTAGE",
      "discountValue": 50,
      "minOrderAmount": 200,
      "maxDiscount": 150,
      "couponCode": "MOVIE50",
      "validFrom": "2025-12-01",
      "validTill": "2025-12-31",
      "isActive": true,
      "usedCount": 245
    }
  ],
  "message": "Offers fetched successfully"
}
```

### Get Offer by ID
```http
GET /api/v1/user/offers/:id
```
**Auth Required:** No

### Get Trending Offers
```http
GET /api/v1/user/offers/trending
```
**Auth Required:** No

### Get Offers by Category
```http
GET /api/v1/user/offers/category/:category
```
**Auth Required:** No

**Example:**
```http
GET /api/v1/user/offers/category/food
```

### Use/Apply Coupon
```http
POST /api/v1/user/offers/:offerId/use
```
**Auth Required:** Yes

**Body:**
```json
{
  "couponCode": "MOVIE50",
  "orderAmount": 500
}
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "offer": {
      "_id": "offer_id",
      "title": "50% Off on Movie Tickets",
      "discountType": "PERCENTAGE",
      "discountValue": 50
    },
    "discountAmount": 150,
    "finalAmount": 350
  },
  "message": "Coupon applied successfully"
}
```

---

## 🍽️ Restaurant Deals

### Get All Restaurants
```http
GET /api/v1/user/restaurants
```
**Auth Required:** No

**Query Parameters:**
- `city` - Filter by city
- `cuisine` - Filter by cuisine
- `rating` - Minimum rating
- `search` - Search restaurants

**Example:**
```http
GET /api/v1/user/restaurants?city=Mumbai&cuisine=Italian&rating=4
```

**Response:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "restaurant_id",
      "name": "Pizza Palace",
      "description": "Best Italian cuisine",
      "cuisine": ["Italian", "Continental"],
      "city": "Mumbai",
      "address": "Bandra West, Mumbai",
      "rating": 4.5,
      "averageCostForTwo": 800,
      "offers": ["offer_id_1", "offer_id_2"],
      "isActive": true
    }
  ],
  "message": "Restaurants fetched successfully"
}
```

### Get Restaurant by ID
```http
GET /api/v1/user/restaurants/:id
```
**Auth Required:** No

### Get Top Rated Restaurants
```http
GET /api/v1/user/restaurants/top-rated
```
**Auth Required:** No

### Get Restaurants by City
```http
GET /api/v1/user/restaurants/city/:cityName
```
**Auth Required:** No

**Example:**
```http
GET /api/v1/user/restaurants/city/Mumbai
```

---

## 📺 OTT Content

### Get All OTT Content
```http
GET /api/v1/user/ott
```
**Auth Required:** No

**Query Parameters:**
- `platform` - Filter by platform (Netflix/Prime/Disney+/etc)
- `genre` - Filter by genre
- `search` - Search content

**Example:**
```http
GET /api/v1/user/ott?platform=Netflix&genre=Action
```

**Response:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "ott_id",
      "title": "Stranger Things",
      "description": "Sci-fi horror series",
      "platform": "Netflix",
      "genre": ["Sci-Fi", "Horror"],
      "rating": 8.7,
      "releaseYear": 2016,
      "image": "image_url",
      "isActive": true
    }
  ],
  "message": "OTT content fetched successfully"
}
```

### Get OTT Content by ID
```http
GET /api/v1/user/ott/:id
```
**Auth Required:** No

### Get Trending OTT Content
```http
GET /api/v1/user/ott/trending
```
**Auth Required:** No

### Get New Releases
```http
GET /api/v1/user/ott/new-releases
```
**Auth Required:** No

### Get Recommended OTT Content
```http
GET /api/v1/user/ott/recommended
```
**Auth Required:** No

### Get OTT Content by Platform
```http
GET /api/v1/user/ott/platform/:platformName
```
**Auth Required:** No

**Example:**
```http
GET /api/v1/user/ott/platform/Netflix
```

---

## ⚠️ Error Responses

All endpoints return errors in this format:

```json
{
  "statusCode": 404,
  "data": null,
  "message": "Movie not found",
  "success": false,
  "errors": []
}
```

**Common Error Codes:**
- `400` - Bad Request (Invalid input)
- `401` - Unauthorized (Missing/invalid token)
- `403` - Forbidden (Access denied)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔐 Authentication Notes

**Public Endpoints (No Auth Required):**
- All GET endpoints for movies, venues, shows, offers, restaurants, OTT

**Protected Endpoints (Auth Required):**
- Profile management (GET/PUT/DELETE /profile)
- Order history (GET /orders)
- Use coupon (POST /offers/:id/use)

**Getting JWT Token:**
Login through auth endpoints to get token, then include in all protected requests.
