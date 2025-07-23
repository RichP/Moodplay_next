# MoodPlay Mobile API Setup Guide

This guide explains how to set up and use the MoodPlay API for your mobile applications.

## API Configuration

### 1. CORS Setup

The API is already configured with CORS middleware to allow cross-origin requests from your mobile apps. This is handled in `src/middleware/cors.js` and applied to the API routes in `src/middleware.js`.

### 2. Authentication

The API uses JWT (JSON Web Token) based authentication. For production, make sure to set the `JWT_SECRET` environment variable to a secure random string:

```
JWT_SECRET=your-secure-random-string
```

### 3. Environment Variables

Make sure to configure these environment variables in your production environment:

```
JWT_SECRET=your-secure-random-string
JWT_EXPIRY=7d
ALLOWED_ORIGINS=https://yourmobileapp.com,app://yourmobileapp
```

## Using the Mobile API Client

We've provided example code for a React Native API client in `src/examples/MoodPlayMobileAPI.js`. This client handles:

1. Authentication and token storage
2. API requests with proper headers
3. Error handling

### Installation (React Native)

1. Install required dependencies:

```bash
npm install @react-native-async-storage/async-storage
```

2. Copy the `MoodPlayMobileAPI.js` file to your mobile app project.

3. Update the `API_URL` constant to point to your deployed API.

### Usage Example

```javascript
import { MoodPlayAPI } from './path/to/MoodPlayMobileAPI';

// Create API instance
const api = new MoodPlayAPI();

// Initialize (loads saved token)
await api.init();

// Login
try {
  const result = await api.login('user@example.com', 'password');
  console.log('Logged in:', result.user);
} catch (error) {
  console.error('Login failed:', error);
}

// Fetch games
try {
  const games = await api.getGames({ selectedMood: 'Happy' });
  console.log('Games:', games);
} catch (error) {
  console.error('Failed to fetch games:', error);
}
```

See `src/examples/MobileGameScreen.jsx` for a complete React Native screen example that uses this API client.

## API Endpoints

Refer to `API_DOCUMENTATION.md` for a complete list of API endpoints, request formats, and responses.

## Security Considerations

1. **SSL**: Always use HTTPS in production to ensure secure data transmission.

2. **Token Storage**: The example uses AsyncStorage, which isn't completely secure. For production, consider using more secure alternatives:
   - iOS: Keychain
   - Android: EncryptedSharedPreferences or Android Keystore
   - Libraries like `react-native-encrypted-storage` or `expo-secure-store`

3. **Token Expiry**: Configure appropriate token expiration time based on your security requirements.

4. **Rate Limiting**: Consider adding rate limiting to your API to prevent abuse.

## Troubleshooting

### CORS Issues

If you encounter CORS errors:

1. Make sure your mobile app's origin is included in the `ALLOWED_ORIGINS` environment variable.
2. For native apps, the origin might be the app's scheme (e.g., `app://yourappname`).

### Authentication Issues

If authentication fails:

1. Check that the token is being sent correctly in the Authorization header.
2. Verify that the JWT_SECRET matches between token generation and validation.
3. Make sure the token hasn't expired.
