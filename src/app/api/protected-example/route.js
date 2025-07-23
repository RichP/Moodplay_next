import { NextResponse } from 'next/server';
import { authenticate } from '@/middleware/auth';

// Sample protected API route
export async function GET(request) {
  // Check authentication
  const auth = await authenticate(request);
  
  // If not authenticated, return the error response
  if (!auth.authenticated) {
    return auth.response;
  }
  
  // User is authenticated, process the request
  // You can access user info with auth.user
  
  return NextResponse.json({
    success: true,
    message: 'This is a protected endpoint',
    user: auth.user // The user info from the JWT token
  });
}
