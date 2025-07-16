"use client";
import React, { useEffect, useState, use } from "react";
import ReactMarkdown from "react-markdown";

export default function BlogPostPage({ params }) {
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const { slug } = use(params);

  useEffect(() => {
    fetch(`/api/blog-posts/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => setPost(data))
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto p-8 mt-8 bg-white rounded-xl shadow">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Post not found</h1>
        <p className="text-gray-700">Sorry, we couldn't find the blog post you're looking for.</p>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 mt-8 bg-white rounded-xl shadow">
      {post.image && (
        <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded mb-6" />
      )}
      <h1 className="text-3xl font-bold text-indigo-700 mb-2">{post.title}</h1>
      <div className="text-xs text-gray-400 mb-4">{new Date(post.date).toLocaleDateString()}</div>
      <div className="prose prose-indigo max-w-full text-gray-800 mb-8 break-words overflow-x-auto">
        <ReactMarkdown
          components={{
            a: ({node, ...props}) => (
              <a
                {...props}
                className="text-indigo-600 underline hover:text-indigo-800 transition-colors"
              />
            ),
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
      <a href="/blog" className="text-indigo-500 hover:underline text-sm">← Back to Blog</a>
    </div>
  );
}
