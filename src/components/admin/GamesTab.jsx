"use client";

export default function GamesTab({ 
  games, 
  form, 
  filter, 
  editingId, 
  editForm, 
  moodOptions, 
  bulkUploadError, 
  handleChange, 
  handleAddGame, 
  startEdit, 
  handleEditChange, 
  saveEdit, 
  cancelEdit, 
  handleDeleteGame, 
  handleBulkUpload, 
  setFilter 
}) {

  return (
    <>
      <form onSubmit={handleAddGame} className="mb-6 grid grid-cols-1 gap-2">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Game Name" className="border p-2" required />
        <select name="mood" value={form.mood} onChange={handleChange} className="border p-2" required>
          <option value="" disabled>Select mood</option>
          {moodOptions.map(opt => (
            <option key={opt.id} value={opt.value}>{opt.value}</option>
          ))}
        </select>
        <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="border p-2" />
        <input name="steamUrl" value={form.steamUrl} onChange={handleChange} placeholder="Steam URL" className="border p-2" />
        <input name="popularity" type="number" value={form.popularity} onChange={handleChange} placeholder="Popularity" className="border p-2" />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add Game</button>
      </form>
      <div className="mb-6">
        <label className="block mb-2 font-semibold">Bulk Upload Games (JSON file)</label>
        <input type="file" accept="application/json" onChange={handleBulkUpload} className="border p-2" />
        {bulkUploadError && <p className="text-red-500 mt-2">{bulkUploadError}</p>}
      </div>
      <h3 className="text-lg font-semibold mb-2">Games List</h3>
      <input
        type="text"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Filter games by name, mood, or description"
        className="border p-2 mb-4 w-full"
      />
      <ul>
        {games
          .filter(game => {
            const q = filter.toLowerCase();
            return (
              game.name.toLowerCase().includes(q) ||
              (game.mood && game.mood.toLowerCase().includes(q)) ||
              (game.description && game.description.toLowerCase().includes(q))
            );
          })
          .map(game => (
            <li key={game.id} className="flex flex-col sm:flex-row justify-between items-center border-b py-2 gap-2">
              <div className="flex-1">
                <span className="font-semibold">{game.name}</span>
                {editingId === game.id ? (
                  <>
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      placeholder="Description"
                      className="border p-1 mx-2"
                      rows={3}
                    />
                    <select
                      name="mood"
                      value={editForm.mood}
                      onChange={handleEditChange}
                      className="border p-1 mx-2"
                      required
                    >
                      <option value="" disabled>Select mood</option>
                      {moodOptions.map(opt => (
                        <option key={opt.id} value={opt.value}>{opt.value}</option>
                      ))}
                    </select>
                  </>
                ) : (
                  <>
                    <span className="mx-2 text-gray-600">
                      {game.description ? game.description.split(' ').slice(0, 8).join(' ') + (game.description.split(' ').length > 8 ? '...' : '') : ''}
                    </span>
                    <span className="mx-2 text-indigo-500">({game.mood})</span>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                {editingId === game.id ? (
                  <>
                    <button onClick={() => saveEdit(game.id)} className="bg-green-500 text-white px-2 py-1 rounded">Save</button>
                    <button onClick={cancelEdit} className="bg-gray-400 text-white px-2 py-1 rounded">Cancel</button>
                  </>
                ) : (
                  <button onClick={() => startEdit(game)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                )}
                <button onClick={() => handleDeleteGame(game.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </div>
            </li>
          ))}
      </ul>
    </>
  );
}
