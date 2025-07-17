"use client";

import MoodSelector from '../components/MoodSelector';
import SearchBarComponent from '../components/SearchBarComponent';
import SortDropdown from '../components/SortDropdown';
import CardComponent from '../components/CardComponent';
// import GameModal from '../components/GameModal';
import Link from 'next/link';
import Head from 'next/head';
import { useState, useEffect } from 'react';
// ...existing code...

export default function HomePage() {
  const [selectedMood, setSelectedMood] = useState('Relaxed');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('popularity');
  // const [modalOpen, setModalOpen] = useState(false);
  // const [modalGame, setModalGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);
  const [moods, setMoods] = useState([]);

  useEffect(() => {
    // Fetch moods from API
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

  useEffect(() => {
    // Fetch games from API
    const fetchGames = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/games?selectedMood=${encodeURIComponent(selectedMood)}`);
        const data = await res.json();
        setGames(data);
      } catch (err) {
        setGames([]);
      }
      setLoading(false);
    };
    fetchGames();
  }, [selectedMood, searchTerm, sortOption]);

  const filteredAndSortedGames = games
    .filter((game) =>
      game.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === 'popularity') {
        return b.popularity - a.popularity;
      } else if (sortOption === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  // const handleOpenModal = (game) => {
  //   setModalGame(game);
  //   setModalOpen(true);
  // };

  // const handleCloseModal = () => {
  //   setModalOpen(false);
  //   setModalGame(null);
  // };

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
  <main className="min-h-screen">
        {/* MoodSelector always full width */}
        <div className="w-full max-w-5xl mx-auto px-4 mb-4">
          <MoodSelector
            moods={moods}
            selectedMood={selectedMood}
            setSelectedMood={setSelectedMood}
          />
          <SearchBarComponent
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <SortDropdown
            sortOption={sortOption}
            setSortOption={setSortOption}
          />
        </div>
        <section>
          <h2 className="text-xl font-semibold mb-4 text-center text-indigo-500">
            Games for "
            <span aria-label={`${selectedMood} mood`}>{selectedMood}</span>" Mood
          </h2>

    <div
  className="w-full grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-start transition-opacity duration-500 overflow-y-scroll"
>

            {(() => {
              const MIN_ITEMS = 4;
              if (loading) {
                // Always render exactly MIN_ITEMS skeletons
                return Array.from({ length: MIN_ITEMS }).map((_, idx) => (
                  <article
                    key={`skeleton-${idx}`}
                    className="group bg-white rounded-xl shadow hover:shadow-lg transform transition duration-300 overflow-hidden flex flex-col border border-slate-200 animate-fade-in"
                  >
                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700" />
                    <div className="flex flex-col flex-1 p-4">
                      <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
                      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                      <div className="flex gap-2 mt-auto">
                        <div className="inline-block h-10 w-24 bg-slate-200 rounded" />
                        <div className="inline-block h-10 w-24 bg-indigo-300 rounded" />
                      </div>
                    </div>
                  </article>
                ));
              }
              if (filteredAndSortedGames.length === 0) {
                // Always render MIN_ITEMS invisible placeholders for empty state
                return Array.from({ length: MIN_ITEMS }).map((_, idx) => (
                  <div
                    key={`placeholder-${idx}`}
                    className="h-64 w-full invisible"
                    aria-hidden="true"
                  />
                ));
              }
              // Always render cards, padded to MIN_ITEMS with invisible placeholders
              const cards = filteredAndSortedGames.map((game) => (
                <CardComponent key={game.id || game.slug} game={game} />
              ));
              const placeholders = [];
              for (let i = cards.length; i < MIN_ITEMS; i++) {
                placeholders.push(
                  <div
                    key={`placeholder-${i}`}
                    className="h-64 w-full invisible"
                    aria-hidden="true"
                  />
                );
              }
              return [...cards, ...placeholders];
            })()}
          </div>
        </section>
  {/* Modal removed, now using game pages for SEO */}
      </main>
    </>
  );
}

// ...existing code...
