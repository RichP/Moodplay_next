# MoodPlay API Documentation

This document provides information about the MoodPlay API endpoints, their functionality, and how to use them.

## Base URL

- Production: `https://moodplay.vercel.app/api`
- Development: `http://localhost:3000/api`

## Authentication

The API uses JWT (JSON Web Token) for authentication.

### Login

```
POST /auth/login
```

**Request Body:**
```json
{
  "username": "your_username",
  "password": "your_password"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "your_username",
    "role": "admin"
  }
}
```

### Using Authentication

Include the token in the Authorization header for all protected endpoints:

```
Authorization: Bearer your_token_here
```

## Endpoints

### Games

#### Get All Games

```
GET /games
```

**Response:**
```json
[
  {
    "id": "1",
    "name": "Game Name",
    "mood": "Calm",
    "description": "Game description",
    "image": "image_url",
    "steamUrl": "steam_url",
    "popularity": 10,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  },
  ...
]
```

#### Get a Game

```
GET /games/{id}
```

**Response:**
```json
{
  "id": "1",
  "name": "Game Name",
  "mood": "Calm",
  "description": "Game description",
  "image": "image_url",
  "steamUrl": "steam_url",
  "popularity": 10,
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z"
}
```

#### Create a Game

```
POST /games
```

**Request Body:**
```json
{
  "name": "New Game",
  "mood": "Calm",
  "description": "Game description",
  "image": "image_url",
  "steamUrl": "steam_url",
  "popularity": 10
}
```

**Response:**
```json
{
  "id": "1",
  "name": "New Game",
  "mood": "Calm",
  "description": "Game description",
  "image": "image_url",
  "steamUrl": "steam_url",
  "popularity": 10,
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z"
}
```

#### Update a Game

```
PATCH /games/{id}
```

**Request Body:**
```json
{
  "description": "Updated description",
  "mood": "Happy"
}
```

**Response:**
```json
{
  "id": "1",
  "name": "Game Name",
  "mood": "Happy",
  "description": "Updated description",
  "image": "image_url",
  "steamUrl": "steam_url",
  "popularity": 10,
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z"
}
```

#### Delete a Game

```
DELETE /games/{id}
```

**Response:**
```json
{
  "success": true
}
```

### Moods

#### Get All Moods

```
GET /moods
```

**Response:**
```json
[
  {
    "id": "1",
    "mood": "Calm",
    "tags": [
      {
        "id": "1",
        "value": "Relaxing",
        "moodId": "1"
      },
      {
        "id": "2",
        "value": "Peaceful",
        "moodId": "1"
      }
    ]
  },
  ...
]
```

#### Create a Mood

```
POST /moods
```

**Request Body:**
```json
{
  "mood": "New Mood"
}
```

**Response:**
```json
{
  "id": "3",
  "mood": "New Mood",
  "tags": []
}
```

#### Update a Mood

```
PATCH /moods/{id}
```

**Request Body:**
```json
{
  "mood": "Updated Mood"
}
```

**Response:**
```json
{
  "id": "3",
  "mood": "Updated Mood",
  "tags": []
}
```

#### Delete a Mood

```
DELETE /moods/{id}
```

**Response:**
```json
{
  "success": true
}
```

### Tags

#### Create a Tag

```
POST /tags
```

**Request Body:**
```json
{
  "value": "New Tag",
  "moodId": "1"
}
```

**Response:**
```json
{
  "id": "3",
  "value": "New Tag",
  "moodId": "1"
}
```

#### Update a Tag

```
PATCH /tags/{id}
```

**Request Body:**
```json
{
  "value": "Updated Tag"
}
```

**Response:**
```json
{
  "id": "3",
  "value": "Updated Tag",
  "moodId": "1"
}
```

#### Delete a Tag

```
DELETE /tags/{id}
```

**Response:**
```json
{
  "success": true
}
```

### Blog Posts

#### Get All Blog Posts

```
GET /blog-posts
```

**Response:**
```json
[
  {
    "id": "1",
    "title": "Blog Post Title",
    "content": "Blog post content",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  },
  ...
]
```

### Suggested Games

#### Get All Suggested Games

```
GET /suggested-games
```

**Response:**
```json
[
  {
    "id": "1",
    "name": "Suggested Game",
    "mood": "Calm",
    "reason": "Reason for suggestion",
    "createdAt": "2023-01-01T00:00:00Z"
  },
  ...
]
```

#### Create a Suggested Game

```
POST /suggested-games
```

**Request Body:**
```json
{
  "name": "New Suggested Game",
  "mood": "Happy",
  "reason": "This is a great game"
}
```

**Response:**
```json
{
  "id": "2",
  "name": "New Suggested Game",
  "mood": "Happy",
  "reason": "This is a great game",
  "createdAt": "2023-01-01T00:00:00Z"
}
```

#### Delete a Suggested Game

```
DELETE /suggested-games/{id}
```

**Response:**
```json
{
  "success": true
}
```

### Feedback

#### Get All Feedback

```
GET /feedback
```

**Response:**
```json
[
  {
    "id": "1",
    "name": "User Name",
    "email": "user@example.com",
    "message": "Feedback message",
    "createdAt": "2023-01-01T00:00:00Z"
  },
  ...
]
```

#### Create Feedback

```
POST /feedback
```

**Request Body:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "message": "New feedback message"
}
```

**Response:**
```json
{
  "id": "2",
  "name": "User Name",
  "email": "user@example.com",
  "message": "New feedback message",
  "createdAt": "2023-01-01T00:00:00Z"
}
```

#### Delete Feedback

```
DELETE /feedback/{id}
```

**Response:**
```json
{
  "success": true
}
```

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "success": false,
  "error": "Error message"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error
