import { NextResponse } from 'next/server';
import { corsMiddleware } from './middleware/cors';

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  // Apply CORS only to /api routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    // Handle preflight OPTIONS request
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: corsMiddleware(request),
      });
    }

    // For actual API requests, we'll add CORS headers to the response
    // This is handled by modifying the response on its way out
    const response = NextResponse.next();
    
    // Add all CORS headers from our middleware
    const corsHeaders = corsMiddleware(request);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  }

  // For other routes, continue without modification
  return NextResponse.next();
}

// Configure to match all API routes
export const config = {
  matcher: ['/api/:path*'],
};
