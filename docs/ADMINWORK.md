# Admin APIs (Current)

Base prefix: `/api/v1/admin`

All endpoints in this file require:
- valid access token
- user with `isAdmin: true`

## Authentication Note
Admin does not have a separate login endpoint. Use:
- `POST /api/v1/auth/login`

The logged-in user must have `isAdmin: true`.

## Movie Management
- `POST /movies`
- `GET /movies`
- `GET /movies/:id`
- `PATCH /movies/:id`
- `DELETE /movies/:id`

## Venue Management
- `POST /venues`
- `GET /venues`
- `GET /venues/:id`
- `PATCH /venues/:id`
- `DELETE /venues/:id`

## Show Management
- `POST /shows`
- `PUT /shows/:showId`
- `DELETE /shows/:showId`
- `GET /shows/now-playing`
- `PATCH /shows/:showId/cancel`
- `PATCH /shows/:showId/complete`
- `POST /shows/bulk-cancel`

## Queue Monitoring
- `GET /queue/stats`
- `GET /queue/health`
- `GET /queue/failed`
- `GET /queue/active`
- `GET /queue/waiting`
- `GET /queue/completed`
- `GET /queue/job/:jobId`

## Queue Management
- `POST /queue/retry/:jobId`
- `POST /queue/retry-all`
- `DELETE /queue/job/:jobId`
- `POST /queue/clean`
- `POST /queue/pause`
- `POST /queue/resume`
- `DELETE /queue/empty`

## Notifications
- `POST /notifications/all`
- `POST /notifications/movie/:movieId`
- `POST /notifications/venue/:venueId`
- `POST /notifications/show/:showId`
- `POST /notifications/schedule`
- `GET /notifications`

## Newsletter
- `POST /newsletter/send`

## Seat Management
- `POST /seats`
- `GET /seats/:showId`

## Authorization Header
`Authorization: Bearer <accessToken>`
