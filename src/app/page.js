"use client";

import MoodSelector from '../components/MoodSelector';
import SearchBarComponent from '../components/SearchBarComponent';
import SortDropdown from '../components/SortDropdown';
import CardComponent from '../components/CardComponent';
import GameCard from '../components/GameCard';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
// import GameModal from '../components/GameModal';
import Link from 'next/link';
import Head from 'next/head';
import { useState, useEffect } from 'react';

import { Fragment } from 'react';

export default function HomePage() {
  // ...existing state...
  const router = useRouter();
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [selectedMood, setSelectedMood] = useState('Relaxed');
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);
  const [moods, setMoods] = useState([]);
  const [currentGame, setCurrentGame] = useState(null);
  const [dislikedIds, setDislikedIds] = useState([]);
  const [likedIds, setLikedIds] = useState([]);
  const [mixtapeOpen, setMixtapeOpen] = useState(false);
  const [mixtapeLoading, setMixtapeLoading] = useState(false);
  const [mixtapeShuffleIdx, setMixtapeShuffleIdx] = useState(null);
  const [mixtapeIdx, setMixtapeIdx] = useState(0);

  // Fetch moods
  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const res = await fetch('/api/moods');
        const data = await res.json();
        setMoods(data);
      } catch (err) {
        setMoods([]);
      }
    };
    fetchMoods();
  }, []);

  // Fetch games for selected mood
  useEffect(() => {
    setLoading(true);
    const fetchGames = async () => {
      try {
        const res = await fetch(`/api/games?selectedMood=${encodeURIComponent(selectedMood)}`);
        
        if (!res.ok) {
          console.error(`Error fetching games: ${res.status}`);
          setGames([]);
          return;
        }
        
        const data = await res.json();
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setGames(data);
        } else {
          console.error("API returned non-array data:", data);
          setGames([]);
        }
      } catch (err) {
        console.error("Error fetching games:", err);
        setGames([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, [selectedMood]);

  // Load likes/dislikes from localStorage
  useEffect(() => {
    const liked = JSON.parse(localStorage.getItem('moodplay_liked') || '[]');
    const disliked = JSON.parse(localStorage.getItem('moodplay_disliked') || '[]');
    setLikedIds(liked);
    setDislikedIds(disliked);
  }, [selectedMood]);

  // Pick a random game excluding disliked
  useEffect(() => {
    if (!games || !Array.isArray(games) || games.length === 0) {
      setCurrentGame(null);
      setRelatedPosts([]);
      return;
    }
    const available = games.filter(g => !dislikedIds.includes(g.id));
    if (available.length === 0) {
      setCurrentGame(null);
      setRelatedPosts([]);
      return;
    }
    const randomIdx = Math.floor(Math.random() * available.length);
    const game = available[randomIdx];
    setCurrentGame(game);
    // Fetch related posts for the selected game
    if (game && game.mood) {
      fetch(`/api/related-posts/${encodeURIComponent(game.mood)}`)
        .then(res => res.json())
        .then(posts => setRelatedPosts(posts || []))
        .catch(() => setRelatedPosts([]));
    } else {
      setRelatedPosts([]);
    }
  }, [games, dislikedIds]);

  // Like/dislike handlers
  const like = () => {
    if (!currentGame) return;
    setMixtapeLoading(true);
    setTimeout(() => {
      const updated = [...likedIds, currentGame.id];
      setLikedIds(updated);
      localStorage.setItem('moodplay_liked', JSON.stringify(updated));
      setMixtapeLoading(false);
      nextRandom();
    }, 1200); // loader duration
  };
  // Get liked games from all games
  const likedGames = Array.isArray(games) ? games.filter(g => likedIds.includes(g.id)) : [];
  // Ensure mixtapeIdx stays in bounds
  useEffect(() => {
    if (likedGames.length === 0) {
      setMixtapeIdx(0);
    } else if (mixtapeIdx >= likedGames.length) {
      setMixtapeIdx(likedGames.length - 1);
    }
  }, [likedGames.length]);

  const nextMixtape = () => {
    setMixtapeIdx(idx => {
      if (likedGames.length === 0) return 0;
      return (idx + 1) >= likedGames.length ? 0 : idx + 1;
    });
  };
  const prevMixtape = () => {
    setMixtapeIdx(idx => {
      if (likedGames.length === 0) return 0;
      return (idx - 1) < 0 ? likedGames.length - 1 : idx - 1;
    });
  };

  // Shuffle logic
  const shuffleMixtape = () => {
  if (likedGames.length === 0) return;
  setMixtapeIdx(Math.floor(Math.random() * likedGames.length));
  };
  const clearMixtape = () => {
    setLikedIds([]);
    localStorage.removeItem('moodplay_liked');
    setMixtapeShuffleIdx(null);
  };
  const dislike = () => {
    if (!currentGame) return;
    const updated = [...dislikedIds, currentGame.id];
    setDislikedIds(updated);
    localStorage.setItem('moodplay_disliked', JSON.stringify(updated));
    nextRandom();
  };
  const nextRandom = () => {
    if (!games || !Array.isArray(games) || games.length === 0) {
      setCurrentGame(null);
      return;
    }
    const available = games.filter(g => !dislikedIds.includes(g.id) && g.id !== (currentGame?.id));
    if (available.length === 0) {
      setCurrentGame(null);
      return;
    }
    const randomIdx = Math.floor(Math.random() * available.length);
    setCurrentGame(available[randomIdx]);
  };

  return (
    <>
      <Head>
        <title>MoodPlay – {selectedMood} Steam Games</title>
        <meta
          name="description"
          content={`Find Steam games for your "${selectedMood}" mood.`}
        />
        <meta property="og:title" content={`MoodPlay – ${selectedMood} Steam Games`} />
        <meta
          property="og:description"
          content={`Discover Steam games for your "${selectedMood}" mood.`}
        />
      </Head>
      <main className="min-h-screen relative">
        <div className="w-full max-w-2xl mx-auto px-4 mb-4">
          <MoodSelector
            moods={moods}
            selectedMood={selectedMood}
            setSelectedMood={setSelectedMood}
          />
        </div>
        {/* Floating Mood Mixtape Button */}
        <button
          className="fixed bottom-8 right-8 z-50 bg-indigo-500 text-white rounded-full shadow-lg p-4 hover:bg-indigo-600 transition flex items-center gap-2"
          style={{ boxShadow: '0 4px 16px rgba(59,130,246,0.15)' }}
          onClick={() => setMixtapeOpen(true)}
          aria-label="Open Mood Mixtape"
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="8" width="20" height="12" rx="3" fill="#fff" stroke="#6366f1" strokeWidth="2"/>
            <rect x="8" y="12" width="12" height="4" rx="2" fill="#6366f1"/>
            <circle cx="8" cy="20" r="2" fill="#6366f1"/>
            <circle cx="20" cy="20" r="2" fill="#6366f1"/>
          </svg>
          <span className="font-semibold">Mood Mixtape</span>
        </button>
        {/* Mood Mixtape Modal */}
        {mixtapeOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            {/* Framer Motion modal animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-3xl shadow-2xl max-w-xl w-full relative border border-gray-200"
              style={{ overflow: 'hidden' }}
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-indigo-500 text-2xl"
                onClick={() => setMixtapeOpen(false)}
                aria-label="Close Mixtape"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold text-center mb-4">🎧 Your {selectedMood} Mood Mixtape</h2>
              {/* Cassette SVG/emoji background */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none select-none" style={{ zIndex: 0 }}>
                {/* SVG cassette tape */}
                <svg width="180" height="80" viewBox="0 0 180 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="10" y="20" width="160" height="40" rx="10" fill="#6366f1"/>
                  <rect x="40" y="35" width="100" height="10" rx="3" fill="#fff"/>
                  <circle cx="40" cy="60" r="8" fill="#fff"/>
                  <circle cx="140" cy="60" r="8" fill="#fff"/>
                  <rect x="80" y="50" width="20" height="8" rx="2" fill="#818cf8"/>
                </svg>
              </div>
              <div className="mb-4 relative z-10">
                {likedGames.length === 0 ? (
                  <div className="text-gray-500 text-center mb-4">No liked games yet. Like some games to build your mixtape!</div>
                ) : (
                  <>
                    <div className="relative flex items-center justify-center" style={{ minHeight: 180 }}>
                      {/* Prev button */}
                      <button
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-indigo-100 text-indigo-700 rounded-full p-2 shadow hover:bg-indigo-200 transition z-10"
                  onClick={prevMixtape}
                  aria-label="Previous game"
                      >
                        ◀
                      </button>
                      {/* Animate card transitions */}
                      <motion.div
                        key={likedGames[mixtapeIdx]?.id}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.3 }}
                        className="w-full flex justify-center"
                      >
                        <GameCard game={likedGames[mixtapeIdx]} />
                      </motion.div>
                      {/* Next button */}
                      <button
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-indigo-100 text-indigo-700 rounded-full p-2 shadow hover:bg-indigo-200 transition z-10"
                  style={{ right: 0, transform: 'translateY(-50%)' }}
                  onClick={nextMixtape}
                  aria-label="Next game"
                      >
                        ▶
                      </button>
                    </div>
                    {/* Counter */}
                    <div className="text-xs text-gray-400 text-center mt-2">Game {likedGames.length > 0 ? mixtapeIdx + 1 : 0} of {likedGames.length}</div>
                  </>
                )}
              </div>
              <div className="flex flex-col gap-4 mt-6 relative z-10">
                <div className="flex justify-between w-full">
                  <button
                    className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200 transition"
                    onClick={shuffleMixtape}
                    disabled={likedGames.length < 2}
                    aria-label="Shuffle mixtape"
                  >
                    🔀 Shuffle
                  </button>
                  <button
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition"
                    onClick={clearMixtape}
                  >
                    🗑️ Clear
                  </button>
                </div>
                <button
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition w-full"
                  onClick={() => {
                    const mixtapeGames = likedGames.map(g => g.name).join(', ');
                    const mixtapeIds = likedGames.map(g => g.id).join(',');
                    const domain = window.location.origin;
                    const mixtapeUrl = `${domain}/mixtape?ids=${mixtapeIds}`;
                    const shareText = `My ${selectedMood} Mood Mixtape: ${mixtapeGames}\n${mixtapeUrl}`;
                    if (navigator.share) {
                      navigator.share({
                        title: 'MoodPlay Mixtape',
                        text: shareText,
                        url: mixtapeUrl
                      });
                    } else {
                      navigator.clipboard.writeText(shareText);
                      alert('Mixtape link copied to clipboard!');
                    }
                  }}
                  aria-label="Share mixtape"
                  disabled={likedGames.length === 0}
                >
                  📤 Share Mixtape
                </button>
              </div>
            </motion.div>
          </div>
        )}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-center text-indigo-500">
            Game for "<span aria-label={`${selectedMood} mood`}>{selectedMood}</span>" Mood
          </h2>
          {mixtapeLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[200px]">
              {/* Animated loader with SVG waveform */}
              <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 animate-pulse">
                <rect x="5" y="20" width="10" height="20" rx="3" fill="#6366f1"/>
                <rect x="20" y="10" width="10" height="30" rx="3" fill="#818cf8"/>
                <rect x="35" y="5" width="10" height="35" rx="3" fill="#a5b4fc"/>
                <rect x="50" y="15" width="10" height="25" rx="3" fill="#6366f1"/>
                <rect x="65" y="10" width="10" height="30" rx="3" fill="#818cf8"/>
                <rect x="80" y="20" width="10" height="20" rx="3" fill="#a5b4fc"/>
                <rect x="95" y="10" width="10" height="30" rx="3" fill="#6366f1"/>
              </svg>
              <div className="text-indigo-500 text-lg font-semibold animate-pulse">Building mixtape...</div>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-indigo-500 text-lg font-semibold animate-pulse">Loading game...</div>
            </div>
          ) : !currentGame ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <p className="text-lg text-gray-400 text-center">No more games found for this mood—try another!</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center max-w-md mx-auto">
                {currentGame.image && (
                  <img
                    src={currentGame.image}
                    alt={currentGame.name + ' cover'}
                    className="w-full max-w-md rounded-lg border mb-6 shadow-md transition-transform duration-200 hover:scale-105"
                    style={{ maxHeight: 340, objectFit: "cover", objectPosition: "center" }}
                    loading="lazy"
                    onError={e => { e.target.onerror = null; e.target.src = '/android-chrome-192x192.png'; }}
                  />
                )}
                <h1 className="text-3xl font-bold mb-2 text-indigo-700 text-center">{currentGame.name}</h1>
                <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">Mood: {currentGame.mood}</span>
                {/* Description hidden on main card. Only shown on details page. */}
                <div className="flex flex-col items-center gap-2 mb-4">
                  {currentGame.popularity !== undefined && (
                    <div className="text-sm text-gray-500">Popularity: <span className="font-semibold">{currentGame.popularity}</span></div>
                  )}
                  {currentGame.createdAt && (
                    <div className="text-xs text-gray-400">Added: {new Date(currentGame.createdAt).toLocaleDateString()}</div>
                  )}
                </div>
                <div className="flex flex-col gap-2 w-full items-center">
                  <a href={currentGame.steamUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition mt-2" aria-label={`View ${currentGame.name} on Steam`}>
                    View on Steam
                  </a>
                  <button
                    className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition mt-2"
                    onClick={() => router.push(`/games/${currentGame.slug || currentGame.id}`)}
                    aria-label={`More info about ${currentGame.name}`}
                  >
                    More Info
                  </button>
                </div>
                <div className="flex w-full justify-between mt-6">
                  <button onClick={dislike} className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-xl shadow hover:bg-red-200">❌</button>
                  <button onClick={like} className="bg-pink-100 text-pink-600 px-4 py-2 rounded-full text-xl shadow hover:bg-pink-200">❤️</button>
                </div>
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
            </>
          )}
        </section>
      </main>
    </>
  );
}
