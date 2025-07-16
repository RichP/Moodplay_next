import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  const suggestions = await prisma.suggestedGame.findMany({ orderBy: { createdAt: 'desc' } });
  return Response.json(suggestions);
}

export async function POST(request) {
  const body = await request.json();
  if (!body.name || !body.mood || !body.reason) {
    return Response.json({ success: false, error: 'Missing required fields' }, { status: 400 });
  }
  const newSuggestion = await prisma.suggestedGame.create({
    data: {
      name: body.name,
      mood: body.mood,
      reason: body.reason,
    },
  });
  return Response.json({ success: true, suggestion: newSuggestion });
}
