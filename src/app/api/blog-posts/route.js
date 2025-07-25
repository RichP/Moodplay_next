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
  
  // Generate a base slug - clean it up properly
  let baseSlug = data.slug?.trim() 
    ? data.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : `post-${Date.now()}`;
  
  try {
    // Always generate a unique slug with timestamp to avoid conflicts
    let finalSlug = `${baseSlug}-${Date.now()}`;
    console.log(`Using generated slug: "${finalSlug}"`);
    
    // Debugging information
    console.log('Creating blog post with data:', {
      title: data.title?.trim() || 'Untitled',
      slug: finalSlug,
      date: validDate
    });
    
    // Try upsert instead of create to avoid ID conflicts
    console.log('Attempting to create post with Prisma upsert');
    const post = await prisma.blogPost.upsert({
      where: {
        slug: finalSlug // We know this is unique because we generated it with timestamp
      },
      update: {
        title: data.title?.trim() || 'Untitled',
        date: validDate,
        excerpt: data.excerpt?.trim() || '',
        image: data.image?.trim() || null,
        content: data.content?.trim() || ''
      },
      create: {
        title: data.title?.trim() || 'Untitled',
        slug: finalSlug,
        date: validDate,
        excerpt: data.excerpt?.trim() || '',
        image: data.image?.trim() || null,
        content: data.content?.trim() || ''
      }
    });
    
    console.log('Post created successfully:', post.id);
    
    // Process tags separately after post creation
    if (post && Array.isArray(data.tags) && data.tags.length > 0) {
      console.log('Processing tags for post ID:', post.id);
      for (const tagValue of data.tags) {
        if (!tagValue?.trim()) continue; // Skip empty tags
        
        try {
          // Try to find existing tag first
          let tag = await prisma.blogTag.findUnique({
            where: { value: tagValue.trim() }
          });
          
          // Handle tag creation
          if (!tag) {
            // Use a clean upsert approach which is more idiomatic Prisma code
            // This will work once the database identity columns are properly set up
            try {
              tag = await prisma.blogTag.upsert({
                where: { 
                  value: tagValue.trim() 
                },
                update: {}, // No need to update if it exists
                create: { 
                  value: tagValue.trim() 
                }
              });
              console.log(`Tag created or found with ID: ${tag.id}`);
            } catch (tagError) {
              console.error('Error with tag upsert:', tagError);
              // As a fallback, try to find the tag again
              tag = await prisma.blogTag.findFirst({
                where: { value: tagValue.trim() }
              });
            }
          }
          
          // Only try to connect if both post and tag exist
          if (post?.id && tag?.id) {
            console.log(`Attempting to connect tag ${tag.id} to post ${post.id}`);
            
            try {
              // Direct create is simpler and more reliable
              await prisma.blogPostToBlogTag.create({
                data: {
                  A: post.id,
                  B: tag.id
                }
              });
              console.log(`Successfully connected tag "${tagValue.trim()}" to post ID ${post.id}`);
            } catch (connectionError) {
              // Connection might already exist - that's fine
              if (connectionError.message?.includes('Unique constraint')) {
                console.log(`Connection between post ${post.id} and tag ${tag.id} already exists`);
              } else {
                console.error('Error connecting tag to post:', connectionError);
              }
            }
          } else {
            console.log(`Cannot connect tag, missing post ID (${post?.id}) or tag ID (${tag?.id})`);
          }
        } catch (tagError) {
          console.error('Error processing tag:', tagValue, tagError);
        }
      }
    } else {
      console.log('No post found or no tags to process');
    }
    
    // Fetch the post with its tags
    if (post) {
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
    } else {
      return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
    }
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred creating the blog post' },
      { status: 500 }
    );
  }
}
