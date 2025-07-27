import { NextResponse } from 'next/server';
import { authService } from '@/services/authService';

/**
 * Middleware to authenticate API requests
 * Use this in your API route handlers
 */
export async function authenticate(request) {
  // Extract token from Authorization header
  console.log('Auth headers:', JSON.stringify(Object.fromEntries([...request.headers])));
  
  const token = authService.extractTokenFromHeader(request.headers);
  
  if (!token) {
    console.log('Authentication failed: No token found');
    return {
      authenticated: false,
      response: NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    };
  }
  
  console.log('Token found, verifying...');
  
  // Verify the token
  const payload = authService.verifyToken(token);
  
  if (!payload) {
    console.log('Authentication failed: Invalid or expired token');
    return {
      authenticated: false,
      response: NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      )
    };
  }
  
  // Handle different token types
  if (payload.tokenType === 'mobile') {
    console.log('Authentication successful for mobile app client');
    
    // Authentication successful for mobile app
    return {
      authenticated: true,
      isMobileClient: true,
      scope: payload.scope,
      user: payload
    };
  } else {
    // Regular user token (likely admin)
    console.log('Authentication successful for user:', payload.username || 'unknown');
    
    // Authentication successful
    return {
      authenticated: true,
      isMobileClient: false,
      user: payload
    };
  }
}
