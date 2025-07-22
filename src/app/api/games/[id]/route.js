import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function DELETE(request, { params }) {
  try {
    // Ensure params is resolved if it's a promise
    const resolvedParams = params instanceof Promise ? await params : params;
    
    if (!resolvedParams || !resolvedParams.id) {
      return Response.json({ error: 'Game ID is required' }, { status: 400 });
    }
    
    const id = parseInt(resolvedParams.id, 10);
    if (isNaN(id)) {
      return Response.json({ error: 'Invalid game ID format' }, { status: 400 });
    }
    
    await prisma.game.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting game:', error);
    return Response.json({ error: error.message || 'Failed to delete game' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    // Ensure params is resolved if it's a promise
    const resolvedParams = params instanceof Promise ? await params : params;
    
    if (!resolvedParams || !resolvedParams.id) {
      return Response.json({ error: 'Game ID is required' }, { status: 400 });
    }
    
    const id = parseInt(resolvedParams.id, 10);
    if (isNaN(id)) {
      return Response.json({ error: 'Invalid game ID format' }, { status: 400 });
    }
    
    const body = await request.json();
    
    const updatedGame = await prisma.game.update({
      where: { id },
      data: body,
    });
    
    return Response.json({ success: true, game: updatedGame });
  } catch (error) {
    console.error('Error updating game:', error);
    return Response.json({ error: error.message || 'Failed to update game' }, { status: 500 });
  }
}
