"use client";
import { useState } from 'react';

export default function SuggestedGamesTab({ 
  suggestedGames, 
  fetchSuggestedGames, 
  fetchGames, 
  moodOptions 
}) {
  const [acceptingSuggestion, setAcceptingSuggestion] = useState(null);
  const [acceptForm, setAcceptForm] = useState({ 
    name: '', 
    mood: '', 
    description: '', 
    image: '', 
    steamUrl: '', 
    popularity: 0 
  });

  // Discard suggested game
  const handleDiscardSuggestion = async (id) => {
    try {
      const response = await fetch(`/api/suggested-games/${id}`, { method: 'DELETE' });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to discard suggestion:', errorData);
        alert(`Failed to discard suggestion: ${errorData.error || 'Unknown error'}`);
        return;
      }
      
      fetchSuggestedGames();
    } catch (error) {
      console.error('Error discarding suggestion:', error);
      alert(`Error discarding suggestion: ${error.message || 'Unknown error'}`);
    }
  };

  // Accept suggested game (open form)
  const handleAcceptSuggestion = (sg) => {
    setAcceptingSuggestion(sg.id);
    setAcceptForm({
      name: sg.name,
      mood: sg.mood,
      description: '',
      image: '',
      steamUrl: '',
      popularity: 0,
    });
  };

  // Handle accept form change
  const handleAcceptFormChange = (e) => {
    setAcceptForm({ ...acceptForm, [e.target.name]: e.target.value });
  };

  // Submit accept form to create game
  const handleAcceptFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/games', {
        cache: "no-store",
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(acceptForm),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to create game from suggestion:', errorData);
        alert(`Failed to create game: ${errorData.error || 'Unknown error'}`);
        return;
      }
      
      setAcceptingSuggestion(null);
      fetchGames();
      
      // Discard suggestion after accepting
      await fetch(`/api/suggested-games/${acceptingSuggestion}`, { method: 'DELETE' });
      fetchSuggestedGames();
    } catch (error) {
      console.error('Error creating game from suggestion:', error);
      alert(`Error creating game: ${error.message || 'Unknown error'}`);
    }
  };

  const handleCancelAccept = () => {
    setAcceptingSuggestion(null);
  };

  return (
    <div className="mb-10">
      <h3 className="text-lg font-semibold mb-2">Suggested Games</h3>
      {suggestedGames.length === 0 ? (
        <div className="text-gray-500">No suggestions yet.</div>
      ) : (
        <ul>
          {suggestedGames.map(sg => (
            <li key={sg.id} className="mb-4 border-b pb-2">
              <div className="font-semibold text-indigo-600">{sg.name}</div>
              <div className="text-gray-700">Mood: <span className="font-medium">{sg.mood}</span></div>
              <div className="mt-1 text-gray-600 italic">Reason: {sg.reason}</div>
              <div className="text-xs text-gray-400 mt-1">Suggested on {new Date(sg.createdAt).toLocaleString()}</div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => handleDiscardSuggestion(sg.id)} className="bg-red-500 text-white px-2 py-1 rounded text-xs">Discard</button>
                <button onClick={() => handleAcceptSuggestion(sg)} className="bg-green-500 text-white px-2 py-1 rounded text-xs">Accept</button>
              </div>
              {/* Accept form for this suggestion */}
              {acceptingSuggestion === sg.id && (
                <form onSubmit={handleAcceptFormSubmit} className="mt-4 p-4 bg-gray-50 rounded border flex flex-col gap-2">
                  <h4 className="font-semibold mb-2">Create Game from Suggestion</h4>
                  <input name="name" value={acceptForm.name} onChange={handleAcceptFormChange} placeholder="Game Name" className="border p-2" required />
                  <select name="mood" value={acceptForm.mood} onChange={handleAcceptFormChange} className="border p-2" required>
                    <option value="" disabled>Select mood</option>
                    {moodOptions.map(opt => (
                      <option key={opt.id} value={opt.value}>{opt.value}</option>
                    ))}
                  </select>
                  <input name="description" value={acceptForm.description} onChange={handleAcceptFormChange} placeholder="Description" className="border p-2" />
                  <input name="image" value={acceptForm.image} onChange={handleAcceptFormChange} placeholder="Image URL" className="border p-2" />
                  <input name="steamUrl" value={acceptForm.steamUrl} onChange={handleAcceptFormChange} placeholder="Steam URL" className="border p-2" />
                  <input name="popularity" type="number" value={acceptForm.popularity} onChange={handleAcceptFormChange} placeholder="Popularity" className="border p-2" />
                  <div className="flex gap-2 mt-2">
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Create Game</button>
                    <button type="button" onClick={handleCancelAccept} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                  </div>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
