

import Link from "next/link";
import Image from "next/image";

// Server-side data fetch for game and related posts
async function getGame(slug) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://www.moodplay.co.uk"}/api/games?slug=${encodeURIComponent(slug)}`, { next: { revalidate: 60 } });
  const games = await res.json();
  return games && games.length > 0 ? games[0] : null;
}

async function getRelatedPosts(mood) {
  if (!mood) return [];
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://www.moodplay.co.uk"}/api/related-posts/${encodeURIComponent(mood)}`, { next: { revalidate: 60 } });
  return await res.json();
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const game = await getGame(resolvedParams.slug);
  if (!game) {
    return {
      title: "Game not found – MoodPlay",
      description: "Game not found."
    };
  }
  return {
    title: `${game.name} – MoodPlay`,
    description: game.description || `Steam game for mood: ${game.mood}`,
    openGraph: {
      title: `${game.name} – MoodPlay`,
      description: game.description || `Steam game for mood: ${game.mood}`,
      images: [game.image],
      url: `https://www.moodplay.co.uk/games/${game.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${game.name} – MoodPlay`,
      description: game.description || `Steam game for mood: ${game.mood}`,
      images: [game.image],
    },
  };
}

export default async function GamePage({ params }) {
  const resolvedParams = await params;
  const game = await getGame(resolvedParams.slug);
  if (!game) {
    return <div className="max-w-2xl mx-auto p-6 text-center text-red-500">Game not found.</div>;
  }
  const relatedPosts = await getRelatedPosts(game.mood);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": game.name,
    "image": game.image ? [game.image] : [],
    "description": game.description || `Steam game for mood: ${game.mood}`,
    "genre": game.mood,
    "url": `https://www.moodplay.co.uk/games/${game.slug}`,
    "author": {
      "@type": "Organization",
      "name": "MoodPlay",
      "url": "https://www.moodplay.co.uk"
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      {/* JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <a href="/" className="text-indigo-500 hover:underline text-sm mb-4 inline-block">← Back to games</a>
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
        {game.image && (
          <Image
            src={game.image}
            alt={game.name}
            width={400}
            height={340}
            className="w-full max-w-md rounded-lg border mb-6 shadow-md"
            style={{ objectFit: "cover" }}
            priority
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
                    <Image src={post.image} alt={post.title} width={320} height={128} className="w-full h-32 object-cover rounded mb-2" />
                  )}
                  <h3 className="text-lg font-semibold text-indigo-700 text-center">{post.title}</h3>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
