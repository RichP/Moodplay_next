import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/blog-posts/[slug] - get a single blog post by slug
export async function GET(req, { params }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
    blogTags: {
      include: {
        blogTag: true, // this gets the actual tag values
      },
    },
  },
  });
  if (!post) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(post, {
    headers: {
  'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=60',
    },
  });
}

// PATCH /api/blog-posts/[slug] - update a blog post by slug
// export async function PATCH(req, { params }) {
//   const { slug } = await params;
//   const data = await req.json();
//   // Prepare tags for set (disconnect all, then connectOrCreate)
//   let tagsArr = [];
//   if (Array.isArray(data.tags)) {
//     tagsArr = data.tags.map((t) => ({
//       where: { value: t },
//       create: { value: t },
//     }));
//   }
//   const post = await prisma.blogPost.update({
//     where: { slug },
//     data: {
//       title: data.title,
//       date: data.date ? new Date(data.date) : undefined,
//       excerpt: data.excerpt,
//       image: data.image,
//       content: data.content,
//       tags: tagsArr.length
//         ? { set: [], connectOrCreate: tagsArr }
//         : undefined,
//     },
//     include: { tags: true },
//   });
//   return NextResponse.json(post);
// }

export async function PATCH(req, { params }) {
  const { slug } = await params; 
  const data = await req.json();

  // Start a transaction for data integrity
  const post = await prisma.$transaction(async (tx) => {
    // Find the post by slug first
    const existingPost = await tx.blogPost.findUnique({
      where: { slug },
      include: { blogTags: true },
    });
    if (!existingPost) {
      throw new Error('Post not found');
    }

    // Delete all join records for this post to clear tags
    await tx.blogPostToBlogTag.deleteMany({
      where: { A: existingPost.id },
    });

    // Prepare tags - upsert them and create join records
    if (Array.isArray(data.tags) && data.tags.length > 0) {
      for (const tagValue of data.tags) {
        // Upsert tag
        const tag = await tx.blogTag.upsert({
          where: { value: tagValue },
          update: {},
          create: { value: tagValue },
        });

        // Create join record
        await tx.blogPostToBlogTag.create({
          data: {
            A: existingPost.id,
            B: tag.id,
          },
        });
      }
    }

    // Handle date validation
    let dateValue;
    if (data.date) {
      dateValue = new Date(data.date);
      // If date is invalid, use current date
      if (isNaN(dateValue.getTime())) {
        dateValue = new Date();
      }
    } else {
      // If no date provided, use existing date from post or current date
      dateValue = existingPost.date || new Date();
    }

    // Update other blog post fields
    return tx.blogPost.update({
      where: { slug },
      data: {
        title: data.title,
        date: dateValue,
        excerpt: data.excerpt,
        image: data.image,
        content: data.content,
      },
      include: {
        blogTags: {
          include: {
            blogTag: true,
          },
        },
      },
    });
  });

  return NextResponse.json(post);
}


// DELETE /api/blog-posts/[slug] - delete a blog post by slug
export async function DELETE(req, { params }) {
  const { slug } = await params;
  await prisma.blogPost.delete({ where: { slug } });
  return NextResponse.json({ success: true });
}
