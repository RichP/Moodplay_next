"use server";
import prisma from '../../../lib/prisma'; // Ensure this path matches your project structure

export async function getRelatedPosts(gameMood) {
  console.log('[getRelatedPosts] gameMood:', gameMood);
  // 1. Get tags for the mood
  const mood = await prisma.mood.findFirst({
    where: { mood: gameMood },
    include: { tags: true },
  });
  console.log('[getRelatedPosts] mood:', mood);
  const moodTags = mood?.tags?.map(t => t.value) || [];
  console.log('[getRelatedPosts] moodTags:', moodTags);
  // 2. Find blog posts with tags matching the mood or any mood tag
  const tagValues = [gameMood, ...moodTags];
  console.log('[getRelatedPosts] tagValues:', tagValues);
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
  orderBy: {
    date: "desc",
  },
  take: 6,
  include: {
    blogTags: {
      include: {
        blogTag: true,
      },
    },
  },
  });
  console.log('[getRelatedPosts] posts:', posts);
  return posts;
}
