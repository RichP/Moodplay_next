import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  const tags = await prisma.tag.findMany();
  return Response.json(tags);
}

export async function POST(request) {
  const body = await request.json();
  const newTag = await prisma.tag.create({
    data: {
      value: body.value,
      moodId: body.moodId,
    },
  });
  return Response.json(newTag);
}
