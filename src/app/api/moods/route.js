import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  const moods = await prisma.mood.findMany({
    include: { tags: true }
  });
  return Response.json(moods);
}
