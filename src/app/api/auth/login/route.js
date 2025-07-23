import { NextResponse } from 'next/server';
import { authService } from '@/services/authService';

// Environment variables for admin credentials
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    // Simple authentication check for admin
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Create a token with admin info
      const token = authService.generateToken({ 
        username,
        role: 'admin',
        // Don't include password in the token!
      });

      return NextResponse.json({ 
        success: true,
        token,
        user: { 
          username, 
          role: 'admin' 
        }
      });
    }
    
    // Invalid credentials
    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
