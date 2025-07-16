import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function DELETE(request, { params }) {
  const { id } = params;
  await prisma.game.delete({ where: { id: Number(id) } });
  return Response.json({ success: true });
}

export async function PATCH(request, { params }) {
  const { id } = params;
  const body = await request.json();
  const updatedGame = await prisma.game.update({
    where: { id: Number(id) },
    data: body,
  });
  return Response.json({ success: true, game: updatedGame });
}
