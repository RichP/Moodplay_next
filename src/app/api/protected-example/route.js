import { NextResponse } from 'next/server';
import { authenticate } from '@/middleware/auth';
import { checkMobileAppAccess } from '@/middleware/mobileAuth';

// Sample protected API route
export async function GET(request) {
  // Check authentication
  const auth = await authenticate(request);
  
  // If not authenticated, return the error response
  if (!auth.authenticated) {
    return auth.response;
  }
  
  // Check mobile app permissions
  const mobileAccess = checkMobileAppAccess(auth, 'GET');
  if (!mobileAccess.hasAccess) {
    return NextResponse.json(mobileAccess.error, { status: mobileAccess.status });
  }
  
  // User is authenticated and has proper permissions, process the request
  const responseData = {
    success: true,
    message: 'This is a protected endpoint',
  };
  
  // Add client-specific information
  if (auth.isMobileClient) {
    responseData.clientType = 'mobile';
    responseData.scope = auth.scope;
  } else {
    responseData.user = auth.user; // The user info from the JWT token
  }
  
  return NextResponse.json(responseData);
}
