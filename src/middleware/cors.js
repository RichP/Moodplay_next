// CORS middleware for Next.js
// This middleware adds CORS headers to API responses

export function corsMiddleware(request) {
  // Define allowed origins - replace with your mobile app's origins or use env variables
  const allowedOrigins = [
    'http://localhost:3000',       // Development
    'https://moodplay.vercel.app', // Production web app
    'capacitor://localhost',       // For Capacitor mobile apps
    'ionic://localhost',           // For Ionic mobile apps
    'exp://localhost:19000',       // For Expo mobile apps
    // Add your mobile app's origin(s) here
  ];

  // Get origin from request
  const origin = request.headers.get('origin') || '';
  
  // Check if the origin is allowed
  const isAllowedOrigin = allowedOrigins.includes(origin) || 
                         process.env.NODE_ENV === 'development'; // Allow all origins in dev
  
  // Define response headers
  const headers = {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-Type, Date, X-Api-Version, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
  
  // Add 'Access-Control-Allow-Origin' only if the origin is allowed
  if (isAllowedOrigin) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  
  return headers;
}
