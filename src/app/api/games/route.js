// API route for games
import prisma from '../../../lib/prisma'; // Use the centralized Prisma client
import { authenticate } from '@/middleware/auth';
import { NextResponse } from 'next/server';

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export async function GET(request) {
  try {
    // Fix: support relative URLs in Next.js app router
    const url = request.url.startsWith('http')
      ? request.url
      : `http://${request.headers.get('host')}${request.url}`;
    const { searchParams } = new URL(url);
    const selectedMood = searchParams.get('selectedMood');
    const slug = searchParams.get('slug');
    const idsParam = searchParams.get('ids');
    let where = {};
    if (selectedMood) {
      where.mood = selectedMood;
    }
    if (slug) {
      where.slug = slug;
    }
    if (idsParam) {
      // Sanitize ids: parse, filter, deduplicate, limit to 20
      const ids = idsParam
        .split(',')
        .map(id => parseInt(id, 10))
        .filter(n => !isNaN(n))
        .filter((n, i, arr) => arr.indexOf(n) === i)
        .slice(0, 20);
      if (ids.length > 0) {
        where.id = { in: ids };
      }
    }
    
    // Check if mock data is specifically requested
    const useMock = searchParams.get('mock') === 'true';
    
    if (useMock) {
      console.log("Mock data specifically requested");
      return Response.json([
        {
          id: 1001,
          name: "Requested Mock Game",
          description: "This mock game was specifically requested via the 'mock=true' parameter",
          mood: selectedMood || "Relaxed",
          image: "https://placehold.co/600x400?text=Requested+Mock",
          steamUrl: "https://store.steampowered.com",
          slug: "requested-mock-game"
        }
      ]);
    }
    
    // Try to connect to the database and fetch games
    try {
      const games = await prisma.game.findMany({ where });
      console.log(`Found ${games.length} games for mood: ${selectedMood || 'all'}`);
      return Response.json(games, {
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=60',
        },
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      
      // Return empty array instead of mock data to avoid confusion
      return Response.json({ error: "Database connection error", message: dbError.message }, { status: 500 });
    }
  } catch (err) {
    console.error("Error in games API:", err);
    return Response.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}

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
  
  const body = await request.json();
  if (Array.isArray(body)) {
    // Bulk upload: filter out games that already exist by steamUrl or name
    const steamUrls = body.map(game => game.steamUrl).filter(Boolean);
    const existingGames = [];
    
    // Handle steamUrl matching - need to do this separately since steamUrl isn't unique
    for (const url of steamUrls) {
      if (!url) continue;
      const game = await prisma.game.findFirst({
        where: { steamUrl: url }
      });
      if (game) existingGames.push(game);
    }
    
    const existingUrlsMap = new Map(existingGames.map(g => [g.steamUrl, g]));
    let updatedCount = 0;
    
    // Update descriptions for existing games if needed
    for (const game of body) {
      if (!game.steamUrl) continue;
      
      const existing = existingUrlsMap.get(game.steamUrl);
      if (
        existing &&
        (!existing.description || existing.description.trim() === "") &&
        game.description && game.description.trim() !== ""
      ) {
        await prisma.game.update({
          where: { id: existing.id },
          data: { 
            description: game.description,
            // Update popularity if provided, ensuring it's an integer
            ...(game.popularity !== undefined ? { 
              popularity: typeof game.popularity === 'string' ? parseInt(game.popularity, 10) || 0 : game.popularity 
            } : {})
          }
        });
        updatedCount++;
      }
    }
    
    const existingUrlsSet = new Set(existingGames.map(g => g.steamUrl));
    
    // Filter games that don't exist yet
    const newGamesSource = body.filter(g => g.steamUrl && !existingUrlsSet.has(g.steamUrl));
    console.log(`Found ${newGamesSource.length} new games to add`);
    
    // Prepare data for createMany operation
    const newGames = [];
    
    for (const game of newGamesSource) {
      // Ensure slug is unique by checking if it exists
      let slug = game.slug || slugify(game.name || 'unnamed-game');
      const existingBySlug = await prisma.game.findUnique({
        where: { slug }
      });
      
      if (existingBySlug) {
        // Append a timestamp to make the slug unique
        slug = `${slug}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      }
      
      // Convert popularity to integer if it's a string
      const popularity = typeof game.popularity === 'string' 
        ? parseInt(game.popularity, 10) || 0 
        : (typeof game.popularity === 'number' ? game.popularity : 0);
        
      newGames.push({
        name: game.name || 'Unnamed Game',
        slug: slug,
        description: game.description || null,
        mood: game.mood || 'Neutral',
        image: game.image || null,
        steamUrl: game.steamUrl || null,
        popularity: popularity
      });
    }
    
    // Use createMany for better performance
    let createdCount = 0;
    if (newGames.length > 0) {
      const result = await prisma.game.createMany({
        data: newGames,
        skipDuplicates: true
      });
      createdCount = result.count;
    }
    
    console.log(`Successfully created ${createdCount} games`);
    
    return Response.json({ success: true, added: createdCount, updated: updatedCount, skipped: body.length - createdCount });
  } else {
    // Single upload: check if game exists by steamUrl
    if (!body.steamUrl) {
      return Response.json({ success: false, error: 'steamUrl required' }, { status: 400 });
    }
    // Use findFirst instead of findUnique since steamUrl is not a @unique field
    const exists = await prisma.game.findFirst({ where: { steamUrl: body.steamUrl } });
    if (exists) {
      // If existing description is empty and new description is not empty, update it
      if ((!exists.description || exists.description.trim() === "") && body.description && body.description.trim() !== "") {
        await prisma.game.update({
          where: { id: exists.id },
          data: { 
            description: body.description,
            // Update popularity if provided, ensuring it's an integer
            ...(body.popularity !== undefined ? { 
              popularity: typeof body.popularity === 'string' ? parseInt(body.popularity, 10) || 0 : body.popularity 
            } : {})
          }
        });
        return Response.json({ success: true, updated: true, message: 'Description updated for existing game' }, { status: 200 });
      }
      return Response.json({ success: false, error: 'Game already exists' }, { status: 409 });
    }
    try {
      // First, check if the slug already exists
      const existingBySlug = await prisma.game.findUnique({
        where: { slug: body.slug || slugify(body.name || 'unnamed-game') }
      });
      
      if (existingBySlug) {
        // Append a timestamp to make the slug unique
        body.slug = `${body.slug || slugify(body.name || 'unnamed-game')}-${Date.now()}`;
        console.log(`Slug already exists, using new slug: ${body.slug}`);
      }
      
      // Use a safer approach that works in both development and production
      // Convert popularity to integer if it's a string
      const popularity = typeof body.popularity === 'string' 
        ? parseInt(body.popularity, 10) || 0 
        : (typeof body.popularity === 'number' ? body.popularity : 0);
      
            // Create the game using standard Prisma API
      const newGame = await prisma.game.create({
        data: {
          name: body.name || 'Unnamed Game',
          slug: body.slug || slugify(body.name || 'unnamed-game'),
          description: body.description || null,
          mood: body.mood || 'Neutral',
          image: body.image || null,
          steamUrl: body.steamUrl || null,
          popularity: popularity
        }
      });
      
      console.log('Game created successfully:', newGame.id);
      
      return Response.json({ success: true, game: newGame });
    } catch (error) {
      console.error('Error creating game:', error);
      return Response.json({ error: error.message || 'Failed to create game' }, { status: 500 });
    }
  }
}

// PATCH/PUT update game endpoint
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
    // Get the game ID from the query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Game ID is required' },
        { status: 400 }
      );
    }
    
    // Parse request body for update data
    const updateData = await request.json();
    
    // Update the game
    const updatedGame = await prisma.game.update({
      where: { id: Number(id) },
      data: {
        ...(updateData.name && { name: updateData.name }),
        ...(updateData.description && { description: updateData.description }),
        ...(updateData.mood && { mood: updateData.mood }),
        ...(updateData.image && { image: updateData.image }),
        ...(updateData.steamUrl && { steamUrl: updateData.steamUrl }),
        ...(updateData.popularity !== undefined && { 
          popularity: typeof updateData.popularity === 'string' 
            ? parseInt(updateData.popularity, 10) || 0 
            : updateData.popularity 
        }),
      },
    });
    
    return NextResponse.json({
      success: true,
      game: updatedGame
    });
  } catch (error) {
    console.error('Error updating game:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update game' },
      { status: 500 }
    );
  }
}

// Alias PUT to PATCH for RESTful consistency
export const PUT = PATCH;

// DELETE game endpoint
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
    // Get the game ID from the query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Game ID is required' },
        { status: 400 }
      );
    }
    
    // Delete the game
    await prisma.game.delete({
      where: { id: Number(id) },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting game:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete game' },
      { status: 500 }
    );
  }
}
