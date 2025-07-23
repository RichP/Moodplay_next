import prisma from '../../../lib/prisma'; // Use the centralized Prisma client
import { authenticate } from '@/middleware/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const moods = await prisma.mood.findMany({
      include: { tags: true }
    });
    
    console.log(`Found ${moods.length} moods`);
    return Response.json(moods);
  } catch (error) {
    console.error("Error fetching moods:", error);
    
    // Return a default mood if we can't get them from the database
    if (process.env.NODE_ENV === 'development') {
      return Response.json([
        { 
          id: 1, 
          mood: 'Relaxed', 
          tags: [
            { id: 1, value: 'chill', moodId: 1 },
            { id: 2, value: 'casual', moodId: 1 }
          ] 
        }
      ]);
    }
    
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create a new mood
export async function POST(request) {
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
    const { mood } = await request.json();
    
    if (!mood) {
      return NextResponse.json(
        { error: 'Mood name is required' },
        { status: 400 }
      );
    }
    
    const newMood = await prisma.mood.create({
      data: { mood },
      include: { tags: true }
    });
    
    return NextResponse.json(newMood, { status: 201 });
  } catch (error) {
    console.error('Error creating mood:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create mood' },
      { status: 500 }
    );
  }
}

// PATCH - Update a mood
export async function PATCH(request) {
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
        { error: 'Mood ID is required' },
        { status: 400 }
      );
    }
    
    const { mood } = await request.json();
    
    if (!mood) {
      return NextResponse.json(
        { error: 'Mood name is required' },
        { status: 400 }
      );
    }
    
    const updatedMood = await prisma.mood.update({
      where: { id: Number(id) },
      data: { mood },
      include: { tags: true }
    });
    
    return NextResponse.json(updatedMood);
  } catch (error) {
    console.error('Error updating mood:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update mood' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a mood
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
        { error: 'Mood ID is required' },
        { status: 400 }
      );
    }
    
    // Delete the mood
    await prisma.mood.delete({
      where: { id: Number(id) }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting mood:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete mood' },
      { status: 500 }
    );
  }
}
