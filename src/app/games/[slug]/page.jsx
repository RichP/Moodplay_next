
"use client";
import { useEffect, useState, use } from "react";
import Head from "next/head";
import Link from "next/link";


export default function GamePage({ params }) {
  const { slug } = use(params);
  const [game, setGame] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGame() {
      setLoading(true);
      try {
        const res = await fetch(`/api/games?slug=${encodeURIComponent(slug)}`);
        const games = await res.json();
        setGame(games && games.length > 0 ? games[0] : null);
      } catch (err) {
        setGame(null);
      }
      setLoading(false);
    }
    fetchGame();
  }, [slug]);

  useEffect(() => {
    async function fetchRelatedPosts() {
      if (!game || !game.mood) return;
      try {
        const res = await fetch(`/api/related-posts/${encodeURIComponent(game.mood)}`);
        const posts = await res.json();
        setRelatedPosts(posts || []);
      } catch (err) {
        setRelatedPosts([]);
      }
    }
    fetchRelatedPosts();
  }, [game]);

  if (loading) {
    return <div className="max-w-2xl mx-auto p-6 text-center">Loading...</div>;
  }
  if (!game) {
    return <div className="max-w-2xl mx-auto p-6 text-center text-red-500">Game not found.</div>;
  }

  return (
    <>
      <Head>
        <title>{game.name} – MoodPlay</title>
        <meta name="description" content={game.description || `Steam game for mood: ${game.mood}`} />
        {/* Open Graph tags */}
        <meta property="og:title" content={`${game.name} – MoodPlay`} />
        <meta property="og:description" content={game.description || `Steam game for mood: ${game.mood}`} />
        <meta property="og:image" content={game.image} />
        <meta property="og:url" content={`https://www.moodplay.co.uk/games/${game.slug}`} />
        {/* Twitter tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${game.name} – MoodPlay`} />
        <meta name="twitter:description" content={game.description || `Steam game for mood: ${game.mood}`} />
        <meta name="twitter:image" content={game.image} />
        {/* JSON-LD structured data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "VideoGame",
          "name": game.name,
          "image": game.image ? [game.image] : [],
          "description": game.description || `Steam game for mood: ${game.mood}`,
          "genre": game.mood,
          "url": `https://www.moodplay.co.uk/games/${game.slug}`,
          "author": {
            "@type": "Organization",
            "name": "MoodPlay"
          }
        }) }} />
      </Head>
      <main className="max-w-2xl mx-auto p-6">
        <a href="/" className="text-indigo-500 hover:underline text-sm mb-4 inline-block">← Back to games</a>
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
          {game.image && (
            <img
              src={game.image}
              alt={game.name}
              className="w-full max-w-md rounded-lg border mb-6 shadow-md"
              style={{ maxHeight: 340, objectFit: "cover" }}
            />
          )}
          <h1 className="text-3xl font-bold mb-2 text-indigo-700 text-center">{game.name}</h1>
          <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">Mood: {game.mood}</span>
          {game.description && (
            <div className="mb-4 text-gray-700 text-center text-lg border-l-4 border-indigo-200 pl-4">{game.description}</div>
          )}
          <div className="flex flex-col items-center gap-2 mb-4">
            {game.popularity !== undefined && (
              <div className="text-sm text-gray-500">Popularity: <span className="font-semibold">{game.popularity}</span></div>
            )}
            {game.createdAt && (
              <div className="text-xs text-gray-400">Added: {new Date(game.createdAt).toLocaleDateString()}</div>
            )}
          </div>
          <a href={game.steamUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition mt-2" aria-label={`View ${game.name} on Steam`}>
            View on Steam
          </a>
        </div>
        {relatedPosts.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4 text-center text-indigo-500">Related Blog Posts</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((post) => (
                <li key={post.slug} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                  <Link href={`/blog/${post.slug}`} className="w-full">
                    {post.image && (
                      <img src={post.image} alt={post.title} className="w-full h-32 object-cover rounded mb-2" />
                    )}
                    <h3 className="text-lg font-semibold text-indigo-700 text-center">{post.title}</h3>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}
