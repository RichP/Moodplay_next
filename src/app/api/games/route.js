// API route for games
import prisma from '../../../lib/prisma'; // Use the centralized Prisma client
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
    
    // Get the current max ID to start our sequence from
    let nextId;
    try {
      const maxIdResult = await prisma.$queryRaw`SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM game`;
      // Convert BigInt to Number to avoid issues
      nextId = Number(maxIdResult[0].next_id);
      console.log(`Starting with ID: ${nextId} for bulk inserts`);
    } catch (error) {
      console.error('Error getting max ID:', error);
      return Response.json({ error: 'Failed to get next ID sequence' }, { status: 500 });
    }
    
    // Insert them one by one to avoid bulk issues
    let createdCount = 0;
    
    for (const game of newGamesSource) {
      try {
        // Try executing SQL directly for each game with an explicit ID
        await prisma.$executeRaw`
          INSERT INTO game (id, name, slug, description, mood, image, "steamUrl", popularity, "createdAt")
          VALUES (
            ${nextId},
            ${game.name || 'Unnamed Game'},
            ${game.slug || slugify(game.name || 'unnamed-game')}, 
            ${game.description || null},
            ${game.mood || 'Neutral'},
            ${game.image || null},
            ${game.steamUrl || null},
            ${typeof game.popularity === 'string' ? parseInt(game.popularity, 10) || 0 : (game.popularity || 0)},
            now()
          )
        `;
        createdCount++;
        nextId++; // Increment for the next game
      } catch (error) {
        console.error(`Error creating game ${game.name}:`, error);
      }
    }
    
    console.log(`Successfully created ${createdCount} games`);
    
    if (newGames.length > 0) {
      await prisma.game.createMany({ data: newGames });
    }
    return Response.json({ success: true, added: newGames.length, updated: updatedCount, skipped: body.length - newGames.length });
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
      // Create an ID - many PostgreSQL installations might have lost their sequence
      // This is a workaround that explicitly sets the ID
      const maxIdResult = await prisma.$queryRaw`SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM game`;
      // Convert BigInt to Number to avoid issues
      const nextId = Number(maxIdResult[0].next_id);
      
      // Use a simplified approach - direct insert with explicit ID
      const result = await prisma.$executeRaw`
        INSERT INTO game (id, name, slug, description, mood, image, "steamUrl", popularity, "createdAt")
        VALUES (
          ${nextId},
          ${body.name || 'Unnamed Game'},
          ${body.slug || slugify(body.name || 'unnamed-game')}, 
          ${body.description || null},
          ${body.mood || 'Neutral'},
          ${body.image || null},
          ${body.steamUrl || null},
          ${typeof body.popularity === 'string' ? parseInt(body.popularity, 10) || 0 : (body.popularity || 0)},
          now()
        )
      `;
      
      console.log('Game inserted via raw SQL with ID:', nextId);
      
      // Fetch the newly created game by ID - convert to number to avoid BigInt issues
      const newGame = await prisma.game.findUnique({ 
        where: { id: Number(nextId) } 
      });
      
      return Response.json({ success: true, game: newGame });
    } catch (error) {
      console.error('Error creating game:', error);
      return Response.json({ error: error.message || 'Failed to create game' }, { status: 500 });
    }
  }
}
