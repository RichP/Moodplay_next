"use client";
import React from "react";
import { useRouter } from 'next/navigation';

export default function CardComponent({ game, onOpenModal, expanded }) {
  const router = typeof window !== 'undefined' ? require('next/navigation').useRouter() : null;
  if (expanded) {
    return (
      <article className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
        {game.image && (
          <img
            src={game.image}
            alt={game.name}
            className="w-full max-w-xs rounded mb-4 mx-auto"
            style={{ maxHeight: 320, objectFit: 'cover' }}
          />
        )}
        <h1 className="text-2xl font-bold mb-2 text-indigo-600">{game.name}</h1>
        <div className="mb-2 text-gray-700">{game.description}</div>
        <div className="mb-2">Mood: <span className="font-semibold text-indigo-500">{game.mood}</span></div>
        {game.steamUrl && (
          <a
            href={game.steamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            aria-label={`View ${game.name} on Steam`}
          >
            View on Steam
          </a>
        )}
      </article>
    );
  }
  return (
    <article
      key={game.id}
      className="group bg-white rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transform transition duration-300 overflow-hidden flex flex-col border border-slate-200"
    >
      <img
        src={game.image}
        alt={game.name}
        loading="lazy"
        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="flex flex-col flex-1 p-4">
        <h2 className="text-lg font-semibold mb-1 text-indigo-500">{game.name}</h2>
        <p className="text-gray-600 mb-4 flex-1">{game.description}</p>
        <div className="flex gap-2">
          <button
            type="button"
            className="inline-block bg-slate-200 text-indigo-700 px-4 py-2 rounded hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            onClick={() => router && router.push(`/games/${game.slug || game.id}`)}
            aria-label={`More information about ${game.name}`}
          >
            More Info
          </button>
          <a
            href={game.steamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            aria-label={`View ${game.name} on Steam`}
          >
            View on Steam
          </a>
        </div>
      </div>
    </article>
  );
}
