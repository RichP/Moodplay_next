import prisma from '../../../../lib/prisma'; // Use the centralized Prisma client

export async function GET(request, context) {
  const params = await context.params;
  const { mood } = params;
  try {
    // Find mood and its tags
    const moodObj = await prisma.mood.findFirst({
      where: { mood },
      include: { tags: true },
    });
    const moodTags = moodObj?.tags?.map(t => t.value) || [];
    const tagValues = [mood, ...moodTags];
    // Find blog posts with tags matching the mood or any mood tag
    const posts = await prisma.blogPost.findMany({
      where: {
        blogTags: {
          some: {
            blogTag: {
              value: {
                in: tagValues,
              },
            },
          },
        },
      },
      orderBy: { date: 'desc' },
      take: 6,
      include: {
        blogTags: { include: { blogTag: true } },
      },
    });
    return Response.json(posts, {
      headers: {
  'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=60',
      },
    });
  } catch (err) {
    return Response.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
