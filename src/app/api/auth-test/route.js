import { NextResponse } from 'next/server';
import { authenticate } from '@/middleware/auth';

// This is a test endpoint to verify our authentication is working
export async function GET(request) {
  // Check authentication
  const auth = await authenticate(request);
  
  if (!auth.authenticated) {
    return auth.response;
  }
  
  // Authentication successful, return the user info from the token
  return NextResponse.json({
    success: true,
    message: 'Authentication successful',
    user: auth.user
  });
}
