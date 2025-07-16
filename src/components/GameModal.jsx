import React, { useEffect, useRef, useState } from "react";

export default function GameModal({ open, game, onClose }) {
  const modalRef = useRef(null);
  const [isVisible, setIsVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      document.getElementById('game-modal-close')?.focus();

      // Trap focus
      const handleTab = (e) => {
        const focusable = modalRef.current.querySelectorAll('button, a, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
        if (e.key === 'Escape') {
          handleClose();
        }
      };
      document.addEventListener('keydown', handleTab);
      return () => document.removeEventListener('keydown', handleTab);
    } else if (isVisible) {
      // Start fade-out animation
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open, isVisible]);

  if (!isVisible || !game) return null;

  const imageSrc = game.bigImage || game.image;

  function handleClose() {
    setIsVisible(true); // keep visible for animation
    if (open) {
      // trigger parent close after animation
      setTimeout(() => {
        onClose();
      }, 300);
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300 ${
        open ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-modal-title"
      aria-describedby="game-modal-desc"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-xl shadow-lg p-6 max-w-lg w-full relative ${
          open ? "animate-modal" : "animate-modal-exit"
        } max-h-[90vh] overflow-y-auto`}
        onClick={e => e.stopPropagation()}
      >
        <button
          id="game-modal-close"
          className="absolute top-2 right-2 text-gray-500 hover:text-indigo-500 text-xl"
          onClick={handleClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h3
          id="game-modal-title"
          className="text-2xl font-bold mb-2 text-indigo-700"
        >
          {game.name || "Game"}
        </h3>
        <img
          src={imageSrc}
          alt={game.name || "Game image"}
          loading="lazy"
          className="w-full h-40 sm:h-64 object-cover rounded mb-4"
        />
        {game.description && (
          <p id="game-modal-desc" className="text-gray-700 mb-4">{game.description}</p>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          {game.tags && game.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {game.tags.map((tag) => (
                <span key={tag} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {game.mood && (
            <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium">
              Mood: {game.mood}
            </span>
          )}
          {game.rating && (
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
              Rating: {game.rating}
            </span>
          )}
          {game.price && (
            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium">
              Price: {game.price}
            </span>
          )}
        </div>
        {game.steamUrl && (
          <a
            href={game.steamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-400 transition"
          >
            Play on Steam
          </a>
        )}
      </div>
      <style>
        {`
          .animate-modal {
            opacity: 0;
            transform: scale(0.95);
            animation: modalFadeIn 0.3s forwards;
          }
          .animate-modal-exit {
            opacity: 1;
            transform: scale(1);
            animation: modalFadeOut 0.3s forwards;
          }
          @keyframes modalFadeIn {
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes modalFadeOut {
            to {
              opacity: 0;
              transform: scale(0.95);
            }
          }
        `}
      </style>
    </div>
  );
}