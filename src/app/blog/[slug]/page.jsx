"use client";
import React, { useEffect, useState, use } from "react";
import Head from "next/head";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

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
    <>
      <Head>
        <title>{post.title}  MoodPlay Blog</title>
        <meta name="description" content={post.description || post.title} />
        {/* Open Graph tags */}
        <meta property="og:title" content={`${post.title}  MoodPlay Blog`} />
        <meta property="og:description" content={post.description || post.title} />
        <meta property="og:image" content={post.image} />
        <meta property="og:url" content={`https://www.moodplay.co.uk/blog/${post.slug}`} />
        {/* Twitter tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${post.title}  MoodPlay Blog`} />
        <meta name="twitter:description" content={post.description || post.title} />
        <meta name="twitter:image" content={post.image} />
        {/* JSON-LD structured data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "image": post.image ? [post.image] : [],
          "author": {
            "@type": "Person",
            "name": "MoodPlay"
          },
          "datePublished": post.date,
          "description": post.excerpt || post.title,
          "url": `https://www.moodplay.co.uk/blog/${post.slug}`
        }) }} />
      </Head>
      <div className="max-w-2xl mx-auto p-8 mt-8 bg-white rounded-xl shadow">
        {post.image && (
          <Image
            src={post.image}
            alt={post.title}
            width={800}
            height={320}
            className="w-full h-64 object-cover rounded mb-6"
            priority
            sizes="(max-width: 768px) 100vw, 800px"
          />
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
        <a href="/blog" className="text-indigo-500 hover:underline text-sm"> Back to Blog</a>
      </div>
    </>
  );
}
