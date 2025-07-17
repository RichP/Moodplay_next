"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("/api/blog-posts")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow mt-8">
      <h1 className="text-3xl font-bold text-indigo-500 mb-4">Blog</h1>
      <p className="text-gray-700 mb-4">Welcome to the MoodPlay blog! Stay tuned for updates, news, and articles about games and moods.</p>
      <div className="space-y-8 mt-8">
        {posts.map((post, idx) => (
          <article key={idx} className="border-b pb-6">
            {post.image && (
              <Image
                src={post.image}
                alt={post.title}
                width={800}
                height={320}
                className="w-full h-48 object-cover rounded mb-3"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            )}
            <h2 className="text-2xl font-semibold text-indigo-700 mb-1">{post.title}</h2>
            <div className="text-xs text-gray-400 mb-2">{new Date(post.date).toLocaleDateString()}</div>
            <p className="text-gray-700 mb-2">{post.excerpt}</p>
            <a href={`/blog/${post.slug}`} className="text-indigo-500 hover:underline text-sm">Read more</a>
          </article>
        ))}
      </div>
    </div>
  );
}
