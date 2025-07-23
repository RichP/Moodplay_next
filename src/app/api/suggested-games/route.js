import { PrismaClient } from '@prisma/client';
import { authenticate } from '@/middleware/auth';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  // Only require authentication for admin access
  const auth = await authenticate(request);
  const isAdmin = auth.authenticated && auth.user.role === 'admin';
  
  try {
    const suggestions = await prisma.suggestedGame.findMany({ 
      orderBy: { createdAt: 'desc' } 
    });
    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Error fetching suggested games:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch suggested games' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.name || !body.mood || !body.reason) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }
    
    const newSuggestion = await prisma.suggestedGame.create({
      data: {
        name: body.name,
        mood: body.mood,
        reason: body.reason,
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      suggestion: newSuggestion 
    });
  } catch (error) {
    console.error('Error creating suggested game:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create suggestion' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a suggested game (admin only)
export async function DELETE(request) {
  // Check authentication
  const auth = await authenticate(request);
  
  // If not authenticated, return the error response
  if (!auth.authenticated) {
    return auth.response;
  }
  
  // Check if user has admin role
  if (auth.user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized. Admin access required' },
      { status: 403 }
    );
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Suggested game ID is required' },
        { status: 400 }
      );
    }
    
    // Delete the suggested game
    await prisma.suggestedGame.delete({
      where: { id: Number(id) }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting suggested game:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete suggested game' },
      { status: 500 }
    );
  }
}
