# Mobile App API Integration Guide

This document provides information on how to integrate a mobile app with the MoodPlay API without requiring user registration.

## Authentication

The API supports mobile app authentication using a shared app secret. This allows your mobile app to access the API without requiring users to create accounts.

### Getting a Token

To authenticate your mobile app, you need to make a POST request to the `/api/auth/mobile` endpoint with your app key:

```javascript
const response = await fetch('https://yourapi.com/api/auth/mobile', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    appKey: 'your-mobile-app-secret'
  })
});

const data = await response.json();
// Store the token securely
const token = data.token;
```

### Using the Token

Use the token in all subsequent requests by including it in the Authorization header:

```javascript
const response = await fetch('https://yourapi.com/api/games', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Token Permissions

Mobile app tokens have read-only access by default, allowing only GET requests. This means your mobile app can:

- Get games and filter by moods
- Get blog posts
- Access other read endpoints

But cannot:

- Create, update or delete data

## Environment Variables

For security, make sure to set these environment variables on your server:

```
MOBILE_APP_SECRET=your-secure-random-string
JWT_SECRET=your-secure-jwt-secret
```

## API Endpoints Available to Mobile Apps

All GET endpoints are available to mobile apps. Here are some key endpoints:

- `GET /api/games` - List all games
- `GET /api/games/:id` - Get a specific game
- `GET /api/moods` - List all moods
- `GET /api/blog-posts` - List all blog posts
- `GET /api/blog-posts/:slug` - Get a specific blog post
- `GET /api/tags` - List all tags

## Error Handling

If your request is not authorized or your token has expired, you'll receive a 401 Unauthorized response:

```json
{
  "success": false,
  "error": "Authentication required"
}
```

If your token is valid but doesn't have sufficient permissions (e.g., trying to POST with a read-only token), you'll receive a 403 Forbidden response:

```json
{
  "success": false,
  "error": "This mobile token only has read-only access"
}
```

## Verifying Token Validity

You can check if your token is still valid by calling:

```javascript
const response = await fetch('https://yourapi.com/api/auth/verify', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
// data.valid will be true if token is valid
```

## Token Expiration

Mobile tokens are valid for 30 days. You should refresh the token before it expires.
