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
  'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=60',
    },
  });
}

// POST /api/blog-posts - create a new blog post
export async function POST(req) {
  const data = await req.json();
  
  // Use current date if no valid date is provided
  const dateValue = data.date ? new Date(data.date) : new Date();
  // Check if date is valid, use current date as fallback
  const validDate = isNaN(dateValue.getTime()) ? new Date() : dateValue;

  try {
    // Create the blog post without tags first
    const post = await prisma.blogPost.create({
      data: {
        title: data.title?.trim() || 'Untitled',
        slug: data.slug?.trim() || `post-${Date.now()}`,
        date: validDate,
        excerpt: data.excerpt?.trim() || '',
        image: data.image?.trim() || null,
        content: data.content?.trim() || '',
      },
    });
    
    // Process tags separately after post creation
    if (Array.isArray(data.tags) && data.tags.length > 0) {
      for (const tagValue of data.tags) {
        if (!tagValue.trim()) continue; // Skip empty tags
        
        // Try to find existing tag first
        let tag = await prisma.blogTag.findUnique({
          where: { value: tagValue.trim() }
        });
        
        // Create tag if it doesn't exist
        if (!tag) {
          tag = await prisma.blogTag.create({
            data: { value: tagValue.trim() }
          });
        }
        
        // Create the connection manually
        await prisma.blogPostToBlogTag.create({
          data: {
            A: post.id,
            B: tag.id
          }
        });
      }
    }
    
    // Fetch the post with its tags
    const completePost = await prisma.blogPost.findUnique({
      where: { id: post.id },
      include: {
        blogTags: {
          include: {
            blogTag: true,
          },
        },
      },
    });
    
    return NextResponse.json(completePost);
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred creating the blog post' },
      { status: 500 }
    );
  }
}
