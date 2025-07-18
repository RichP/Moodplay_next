// Mock DB logic for games API
//import { PrismaClient } from '../../../generated/prisma';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
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
    const games = await prisma.game.findMany({ where });
    return Response.json(games, {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=60',
      },
    });
  } catch (err) {
    return Response.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}

export async function POST(request) {
  const body = await request.json();
  if (Array.isArray(body)) {
    // Bulk upload: filter out games that already exist by steamUrl
    const steamUrls = body.map(game => game.steamUrl).filter(Boolean);
    const existingGames = await prisma.game.findMany({
      where: { steamUrl: { in: steamUrls } }
    });
    const existingUrlsMap = new Map(existingGames.map(g => [g.steamUrl, g]));
    let updatedCount = 0;
    // Update descriptions for existing games if needed
    for (const game of body) {
      const existing = existingUrlsMap.get(game.steamUrl);
      if (
        existing &&
        (!existing.description || existing.description.trim() === "") &&
        game.description && game.description.trim() !== ""
      ) {
        await prisma.game.update({
          where: { id: existing.id },
          data: { description: game.description }
        });
        updatedCount++;
      }
    }
    const existingUrlsSet = new Set(existingGames.map(g => g.steamUrl));
    const newGames = body.filter(game => game.steamUrl && !existingUrlsSet.has(game.steamUrl)).map(game => ({
      ...game,
      slug: game.slug || slugify(game.name)
    }));
    if (newGames.length > 0) {
      await prisma.game.createMany({ data: newGames });
    }
    return Response.json({ success: true, added: newGames.length, updated: updatedCount, skipped: body.length - newGames.length });
  } else {
    // Single upload: check if game exists by steamUrl
    if (!body.steamUrl) {
      return Response.json({ success: false, error: 'steamUrl required' }, { status: 400 });
    }
    const exists = await prisma.game.findUnique({ where: { steamUrl: body.steamUrl } });
    if (exists) {
      // If existing description is empty and new description is not empty, update it
      if ((!exists.description || exists.description.trim() === "") && body.description && body.description.trim() !== "") {
        await prisma.game.update({
          where: { id: exists.id },
          data: { description: body.description }
        });
        return Response.json({ success: true, updated: true, message: 'Description updated for existing game' }, { status: 200 });
      }
      return Response.json({ success: false, error: 'Game already exists' }, { status: 409 });
    }
    const newGame = await prisma.game.create({ data: { ...body, slug: body.slug || slugify(body.name) } });
    return Response.json({ success: true, game: newGame });
  }
}
