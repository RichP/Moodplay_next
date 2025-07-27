import { NextResponse } from 'next/server';
import { authService } from '@/services/authService';

// Environment variable for mobile app authentication
const MOBILE_APP_SECRET = process.env.MOBILE_APP_SECRET || 'mobile-app-secret-change-in-production';

/**
 * Mobile app authentication endpoint
 * This endpoint allows mobile apps to obtain a limited-scope JWT token
 * using a pre-shared secret key instead of username/password
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { appKey } = body;
    
    // Verify the app key matches our secret
    if (appKey === MOBILE_APP_SECRET) {
      // Create a token with limited mobile app permissions
      const token = authService.generateMobileToken({ 
        clientType: 'mobile',
        // Add any additional data you want in the token
      });

      return NextResponse.json({ 
        success: true,
        token
      });
    }
    
    // Invalid app key
    return NextResponse.json(
      { success: false, error: 'Invalid app key' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Mobile authentication error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
