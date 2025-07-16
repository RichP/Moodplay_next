import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.blogPost.createMany({
    data: [
      {
        title: 'Why Mood-Based Game Discovery Works',
        slug: 'why-mood-based-game-discovery-works',
        date: new Date('2025-07-10'),
        excerpt: 'Explore how matching games to your mood can help you find the perfect experience every time you play.',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
        content: `Mood-based game discovery is a new way to find games that match how you feel. Instead of searching by genre or popularity, you can discover titles that fit your current mood—whether you want to relax, get excited, or just have fun.\n\nThis approach helps players find hidden gems and enjoy gaming experiences that truly resonate with them. Try it out on MoodPlay!`,
      },
      {
        title: 'Top 5 Relaxing Steam Games for 2025',
        slug: 'top-5-relaxing-steam-games-2025',
        date: new Date('2025-07-01'),
        excerpt: 'Unwind with these calming titles that are perfect for a chill evening or a stress-free weekend.',
        image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
        content: `Looking to unwind? Here are our top 5 relaxing Steam games for 2025:\n\n1. Stardew Valley\n2. Spiritfarer\n3. Dorfromantik\n4. Unpacking\n5. A Short Hike\n\nEach of these games offers a peaceful, stress-free experience.`,
      },
      {
        title: 'How to Suggest a Game on MoodPlay',
        slug: 'how-to-suggest-a-game-on-moodplay',
        date: new Date('2025-06-20'),
        excerpt: 'A quick guide to sharing your favorite games with the MoodPlay community.',
        image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
        content: `Want to see your favorite game on MoodPlay? Just use the Suggest feature on our site! Fill in the game details and why you think it fits a certain mood. Our team will review your suggestion and add it if it fits.`,
      },
    ]
  });
  console.log('Seeded blog posts!');
}

main().finally(() => prisma.$disconnect());
