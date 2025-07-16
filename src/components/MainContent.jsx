import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import MoodSelector from "./MoodSelector";
import SearchBarComponent from "./SearchBarComponent";
import CardComponent from "./CardComponent";
import GameModal from "./GameModal";
import SortDropdown from "./SortDropdown.jsx";

export default function MainContent({
  moods,
  selectedMood,
  setSelectedMood,
  filteredGames,
  filteredAndSortedGames,
  searchTerm,
  setSearchTerm,
  sortOption,
  setSortOption
}) {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalGame, setModalGame] = useState(null);

  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Simulate fetch delay
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [selectedMood]);


  // Function to open modal with selected game
  function handleOpenModal(game) {
    setModalGame(game);
    setModalOpen(true);
  }

  // Function to close modal
  function handleCloseModal() {
    setModalOpen(false);
    setModalGame(null);
  }

  return (
    <main>
      <Helmet>
        <title>MoodPlay – {selectedMood} Steam Games</title>
        <meta name="description" content={`Find Steam games for your "${selectedMood}" mood.`} />
        <meta property="og:title" content={`MoodPlay – ${selectedMood} Steam Games`} />
        <meta property="og:description" content={`Discover Steam games for your "${selectedMood}" mood.`} />
      </Helmet>
      {/* MoodSelector always full width */}
      <div className="w-full max-w-5xl mx-auto px-4 mb-4">
        <MoodSelector
          moods={moods}
          selectedMood={selectedMood}
          setSelectedMood={setSelectedMood}
        />
      </div>
      {/* Search and Sort in grid */}
      <section className="w-full max-w-5xl mx-auto px-4 flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:items-center mb-6">
        <div className="h-full flex items-center">
          <SearchBarComponent
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
        <div className="h-full flex items-center">
          <SortDropdown
            sortOption={sortOption}
            setSortOption={setSortOption}
          />
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4 text-center text-indigo-500">
  Games for "<span aria-label={`${selectedMood} mood`}>{selectedMood}</span>" Mood
</h2>

        <div
          key={selectedMood}
          className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 min-h-[400px] transition-opacity duration-500 opacity-0 animate-fade-in"
          style={{ animation: 'fadeIn 0.6s forwards' }}
        >
          {loading ? (
            <div className="col-span-full flex items-center justify-center min-h-[200px]">
              <div className="text-indigo-500 text-lg font-semibold animate-pulse">
                Loading games...
              </div>
            </div>
          ) : filteredAndSortedGames.length === 0 ? (
            <div className="col-span-full flex items-center justify-center min-h-[200px]">
              <p className="text-lg text-gray-400 text-center">
                No games found for this mood—try another!
              </p>
            </div>
          ) : (
            filteredAndSortedGames.map((game) => (
              <CardComponent
                key={game.id}
                game={game}
                onOpenModal={() => handleOpenModal(game)}
              />
            ))
          )}
        </div>
      </section>
      <GameModal
        open={modalOpen}
        game={modalGame}
        onClose={handleCloseModal}
      />
    </main>
  );
}