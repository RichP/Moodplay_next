import { authService } from '@/services/authService';
import { NextResponse } from 'next/server';

export async function GET(request) {
  // Get the token from the Authorization header
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ 
      valid: false, 
      message: 'Authorization header is missing or invalid' 
    }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // Verify the token
    const decoded = authService.verifyToken(token);
    
    // Token is valid
    return NextResponse.json({ 
      valid: true, 
      user: { username: decoded.username }
    });
  } catch (error) {
    // Token is invalid or expired
    return NextResponse.json({ 
      valid: false, 
      message: error.message 
    }, { status: 401 });
  }
}
