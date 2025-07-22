import React from "react";

export default function MoodSelector({ moods, selectedMood, setSelectedMood }) {
  return (
    <section className="text-center mb-8 w-full">
      <h2 className="text-xl font-semibold mb-4 text-indigo-500">Select Your Mood</h2>
      <div
        className="
          flex flex-wrap justify-center gap-2 mb-4 px-1 
          sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-3
        "
      >
        {moods.map((moodObj) => (
          <button
            key={moodObj.id}
            className={`text-sm px-4 py-1.5 rounded-full border font-medium shadow-sm transition duration-200 truncate
      ${selectedMood === moodObj.mood
                ? 'bg-indigo-500 text-white border-indigo-500 scale-105'
                : 'bg-gray-100 text-indigo-500 border-gray-300 hover:bg-indigo-50 hover:border-indigo-400 hover:shadow-md'
              }`}
            title={moodObj.mood}
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