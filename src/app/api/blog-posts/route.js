import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/blog-posts - list all blog posts
export async function GET() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { date: 'desc' },
    include: {
    blogTags: {
      include: {
        blogTag: true, // this gets the actual tag values
      },
    },
  },
  });
  return NextResponse.json(posts, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600',
    },
  });
}

// POST /api/blog-posts - create a new blog post
export async function POST(req) {
  const data = await req.json();
  const tagsArr = Array.isArray(data.tags)
    ? data.tags.map((t) => ({
        where: { value: t },
        create: { value: t },
      }))
    : [];
  const post = await prisma.blogPost.create({
    data: {
      title: data.title,
      slug: data.slug,
      date: new Date(data.date),
      excerpt: data.excerpt,
      image: data.image,
      content: data.content,
      tags: {
        connectOrCreate: tagsArr,
      },
    },
    include: { tags: true },
  });
  return NextResponse.json(post);
}
