// Run with: npx prisma db seed --preview-feature -- --script=prisma/scripts/backfill-game-slugs.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function main() {
  const games = await prisma.game.findMany();
  for (const game of games) {
    if (!game.slug || game.slug === '') {
      const baseSlug = slugify(game.name);
      let slug = baseSlug;
      let i = 1;
      // Ensure uniqueness
      while (await prisma.game.findFirst({ where: { slug } })) {
        slug = `${baseSlug}-${i++}`;
      }
      await prisma.game.update({ where: { id: game.id }, data: { slug } });
      console.log(`Set slug for game ${game.name}: ${slug}`);
    }
  }
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
