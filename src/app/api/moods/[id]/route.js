import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function PATCH(request, { params }) {
  const { id } = params;
  const body = await request.json();
  const updatedMood = await prisma.mood.update({
    where: { id: Number(id) },
    data: { mood: body.mood },
  });
  return Response.json({ success: true, mood: updatedMood });
}

export async function DELETE(request, { params }) {
  const { id } = params;
  await prisma.tag.deleteMany({ where: { moodId: Number(id) } });
  await prisma.mood.delete({ where: { id: Number(id) } });
  return Response.json({ success: true });
}
