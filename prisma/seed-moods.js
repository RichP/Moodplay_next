import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Example moods and tags
  const moods = [
    {
      mood: 'Relaxed',
      tags: ['chill', 'casual', 'laid-back']
    },
    {
      mood: 'Excited',
      tags: ['action', 'fast', 'adrenaline']
    },
    {
      mood: 'Focused',
      tags: ['strategy', 'puzzle', 'thinking']
    },
    {
      mood: 'Creative',
      tags: ['sandbox', 'build', 'design']
    },
    {
      mood: 'Competitive',
      tags: ['multiplayer', 'ranked', 'challenge']
    },
    {
      mood: 'Scared',
      tags: ['horror', 'thriller', 'dark']
    }
  ];

  for (const m of moods) {
    const mood = await prisma.mood.create({ data: { mood: m.mood } });
    for (const tag of m.tags) {
      await prisma.tag.create({ data: { value: tag, moodId: mood.id } });
    }
  }
  console.log('Seeded moods and tags');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
