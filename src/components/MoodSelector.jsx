import React from "react";

export default function MoodSelector({ moods, selectedMood, setSelectedMood }) {
  return (
    <section className="text-center mb-8 w-full">
      <h2 className="text-xl font-semibold mb-4 text-indigo-500">Select Your Mood</h2>
      <div
        className="
          flex overflow-x-auto gap-3 mb-4 px-1 hide-scrollbar
          sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 sm:gap-4 sm:overflow-x-visible
        "
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {moods.map((moodObj) => (
          <button
            key={moodObj.id}
            className={`text-sm px-4 py-1.5 rounded-full border font-medium shadow-sm transition duration-200 whitespace-nowrap
      ${selectedMood === moodObj.mood
                ? 'bg-indigo-500 text-white border-indigo-500 scale-105'
                : 'bg-gray-100 text-indigo-500 border-gray-300 hover:bg-indigo-50 hover:border-indigo-400 hover:shadow-md'
              }`}
            onClick={() => setSelectedMood(moodObj.mood)}
          >
            {moodObj.mood}
          </button>
        ))}
      </div>
      <style>
        {`
          .hide-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </section>
  );
}