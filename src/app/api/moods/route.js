import prisma from '../../../lib/prisma'; // Use the centralized Prisma client

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
