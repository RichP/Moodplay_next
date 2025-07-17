
import ReactMarkdown from "react-markdown";
import Image from "next/image";

async function getBlogPost(slug) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "https://www.moodplay.co.uk"}/api/blog-posts/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return await res.json();
}

export async function generateMetadata({ params }) {
  const post = await getBlogPost(params.slug);
  if (!post) return { title: "Post not found – MoodPlay Blog" };
  return {
    title: `${post.title} – MoodPlay Blog`,
    description: post.description || post.title,
    openGraph: {
      title: `${post.title} – MoodPlay Blog`,
      description: post.description || post.title,
      images: post.image ? [post.image] : [],
      url: `https://www.moodplay.co.uk/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} – MoodPlay Blog`,
      description: post.description || post.title,
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const post = await getBlogPost(params.slug);
  if (!post) {
    return (
      <div className="max-w-2xl mx-auto p-8 mt-8 bg-white rounded-xl shadow">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Post not found</h1>
        <p className="text-gray-700">Sorry, we couldn't find the blog post you're looking for.</p>
      </div>
    );
  }
  return (
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
      {/* JSON-LD structured data for SEO */}
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
      <a href="/blog" className="text-indigo-500 hover:underline text-sm">← Back to Blog</a>
    </div>
  );
}
