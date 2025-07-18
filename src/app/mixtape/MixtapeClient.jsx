"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import GameCard from '../../components/GameCard';
import { Suspense } from 'react';

const mixtapeTitles = [
  "My {mood} vibes mix",
  "Found some {mood} games",
  "{mood} mood playlist",
  "{mood} gaming session",
  "{mood} picks for you",
  "{mood} energy games",
];
function getRandomTitle(mood) {
  const titleTemplate = mixtapeTitles[Math.floor(Math.random() * mixtapeTitles.length)];
  return titleTemplate.replace(/{mood}/gi, mood || "mood");
}

export default function MixtapeClient() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get('ids');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("My Mixtape");

  useEffect(() => {
    if (!idsParam) {
      setGames([]);
      setLoading(false);
      setTitle("My Mixtape");
      return;
    }
    const fetchGames = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/games?ids=${idsParam}`);
        const data = await res.json();
        setGames(data);
        if (data && data.length > 0 && data[0].mood) {
          setTitle(getRandomTitle(data[0].mood));
        } else {
          setTitle("My Mixtape");
        }
      } catch (err) {
        setGames([]);
        setTitle("My Mixtape");
      }
      setLoading(false);
    };
    fetchGames();
  }, [idsParam]);

  return (
    <>
      <Head>
        <title>{title} | Moodplay</title>
        <meta name="description" content="Check out this custom Mood Mixtape shared on Moodplay! Discover new games by mood." />
        <meta property="og:title" content={`${title} | Moodplay`} />
        <meta property="og:description" content="Check out this custom Mood Mixtape shared on Moodplay! Discover new games by mood." />
        <meta property="og:image" content={`/api/og/mixtape?ids=${idsParam || ''}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${title} | Moodplay`} />
        <meta name="twitter:description" content="Check out this custom Mood Mixtape shared on Moodplay! Discover new games by mood." />
        <meta name="twitter:image" content={`/api/og/mixtape?ids=${idsParam || ''}`} />
      </Head>
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow mt-8">
        <div className="flex items-center mb-4">
          <svg className="w-12 h-12 mr-3" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="28" width="28" height="10" rx="5" fill="#6366f1" />
            <circle cx="24" cy="20" r="8" fill="#6366f1" stroke="#fff" strokeWidth="2" />
            <rect x="22" y="10" width="4" height="10" rx="2" fill="#6366f1" />
            <circle cx="24" cy="20" r="2" fill="#fff" />
          </svg>
          <h1 className="text-3xl font-bold text-indigo-500">{title}</h1>
        </div>
        {loading ? (
          <div className="text-indigo-500 text-lg font-semibold animate-pulse">Loading mixtape...</div>
        ) : games.length === 0 ? (
          <div className="text-gray-500 text-center">No games found for this mixtape.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {games.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
