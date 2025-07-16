"use client";
import { useState } from "react";
import { useEffect } from "react";

export default function Suggest() {
  const [submitted, setSubmitted] = useState(false);
  const [moods, setMoods] = useState([]);
  const [form, setForm] = useState({ name: '', mood: '', reason: '' });
  const [loading, setLoading] = useState(false);
  const isFormValid = form.name && form.mood && form.reason;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid) return;
    setLoading(true);
    try {
      const res = await fetch('/api/suggested-games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, mood: form.mood, reason: form.reason }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      // Optionally handle error
    }
    setLoading(false);
  }

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const res = await fetch('/api/moods');
        const data = await res.json();
        setMoods(data.map(m => m.mood));
      } catch (err) {
        setMoods([]);
      }
    };
    fetchMoods();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow mt-8">
      <h1 className="text-3xl font-bold text-indigo-500 mb-4">Suggest a Game</h1>
      <p className="text-gray-700 mb-4">
        Know a great Steam game for a mood? Suggest it below!
      </p>
      {submitted ? (
        <div className="text-green-600 font-semibold">Thank you for your suggestion!</div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            required
            placeholder="Game name"
            className="border rounded px-4 py-2"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          <select
            required
            className="border rounded px-4 py-2"
            name="mood"
            value={form.mood}
            onChange={handleChange}
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
            value={form.reason}
            onChange={handleChange}
          />
          <button
            type="submit"
            className={`bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition ${!isFormValid || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isFormValid || loading}
          >
            {loading ? 'Submitting...' : 'Suggest Game'}
          </button>
        </form>
      )}
    </div>
  );
}