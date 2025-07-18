import React from "react";

export default function GameCard({ game }) {
  if (!game) return null;
  return (
    <div className="bg-indigo-50 rounded-2xl shadow-lg p-5 flex flex-col items-center relative border border-indigo-100" style={{ minWidth: 260 }}>
      {/* Cassette tape emoji for extra flair */}
      <div className="absolute top-2 left-2 text-2xl opacity-40 select-none pointer-events-none">📼</div>
      {game.image && (
        <img
          src={game.image}
          alt={game.name}
          className="w-full max-w-xs rounded-xl mb-4 mx-auto border border-indigo-200 shadow"
          style={{ maxHeight: 140, objectFit: 'cover' }}
        />
      )}
      <h3 className="text-lg font-bold text-indigo-700 text-center mb-2">{game.name}</h3>
      <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold mb-2">Mood: {game.mood}</span>
  {/* Description hidden on mixtape screen. Only shown on details page. */}
      <a
        href={game.steamUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-sm mt-2"
        aria-label={`View ${game.name} on Steam`}
      >
        View on Steam
      </a>
    </div>
  );
}
