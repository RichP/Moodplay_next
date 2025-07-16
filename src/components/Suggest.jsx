import React, { useState } from "react";
import moods from "./moods";

export default function Suggest() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    setSubmitted(true);
    // No preventDefault, so form will submit normally
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow mt-8">
      <h1 className="text-3xl font-bold text-indigo-500 mb-4">Suggest a Game</h1>
      <p className="text-gray-700 mb-4">
        Know a great Steam game for a mood? Suggest it below!
      </p>
      {submitted ? (
        <div className="text-green-600 font-semibold">Thank you for your suggestion!</div>
      ) : (
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
          action="https://formsubmit.co/richcpp+moodplay@googlemail.com"
          method="POST"
        >
          <input
            type="text"
            required
            placeholder="Game name"
            className="border rounded px-4 py-2"
            name="game"
          />
          <select
            required
            className="border rounded px-4 py-2"
            name="mood"
            defaultValue=""
          >
            <option value="" disabled>
              Select mood
            </option>
            {moods.map((mood) => (
              <option key={mood} value={mood}>
                {mood}
              </option>
            ))}
          </select>
          <input
            type="text"
            required
            placeholder="Why is it great for this mood?"
            className="border rounded px-4 py-2"
            name="reason"
          />
          <button
            type="submit"
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
          >
            Suggest Game
          </button>
        </form>
      )}
    </div>
  );
}