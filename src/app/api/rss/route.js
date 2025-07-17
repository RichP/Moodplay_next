import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { date: 'desc' },
    take: 20,
  });

  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://moodplay.co.uk';
  const rssItems = posts.map(post => `
    <item>
      <title>${post.title}</title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <description>${post.excerpt || post.title}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid>${siteUrl}/blog/${post.slug}</guid>
    </item>
  `).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>MoodPlay Blog</title>
        <link>${siteUrl}/blog</link>
        <description>Latest blog posts from MoodPlay</description>
        ${rssItems}
      </channel>
    </rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600',
    },
  });
}
