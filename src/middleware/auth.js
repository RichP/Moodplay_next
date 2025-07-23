import { NextResponse } from 'next/server';
import { authService } from '@/services/authService';

/**
 * Middleware to authenticate API requests
 * Use this in your API route handlers
 */
export async function authenticate(request) {
  // Extract token from Authorization header
  const token = authService.extractTokenFromHeader(request.headers);
  
  if (!token) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    };
  }
  
  // Verify the token
  const payload = authService.verifyToken(token);
  
  if (!payload) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      )
    };
  }
  
  // Authentication successful
  return {
    authenticated: true,
    user: payload
  };
}
