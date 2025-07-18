"use client";
import { useState, useEffect } from 'react';



export default function AdminPage() {
  // State for accepting a suggestion
  const [acceptingSuggestion, setAcceptingSuggestion] = useState(null);
  const [acceptForm, setAcceptForm] = useState({ name: '', mood: '', description: '', image: '', steamUrl: '', popularity: 0 });
  // Discard suggested game
  const handleDiscardSuggestion = async (id) => {
    await fetch(`/api/suggested-games/${id}`, { method: 'DELETE' });
    fetchSuggestedGames();
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
    await fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(acceptForm),
    });
    setAcceptingSuggestion(null);
    fetchGames();
    // Optionally discard suggestion after accepting
    await fetch(`/api/suggested-games/${acceptingSuggestion}`, { method: 'DELETE' });
    fetchSuggestedGames();
  };

  const handleCancelAccept = () => {
    setAcceptingSuggestion(null);
  };
  // State: all moods for dropdown
  // (no need for allTags for games dropdown)
  // State for adding a new tag
  const [newTagValue, setNewTagValue] = useState('');
  const [addingTagMoodId, setAddingTagMoodId] = useState(null);

  // State: moods/tags
  const [moods, setMoods] = useState([]);
  const [moodEditId, setMoodEditId] = useState(null);
  const [moodEditValue, setMoodEditValue] = useState('');
  const [tagEditId, setTagEditId] = useState(null);
  const [tagEditValue, setTagEditValue] = useState('');

  // State: authentication
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // State: games
  const [games, setGames] = useState([]);
  const [filter, setFilter] = useState('');
  const [form, setForm] = useState({ name: '', mood: '', image: '', steamUrl: '', popularity: 0 });
  const [bulkUploadError, setBulkUploadError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ description: '', mood: '' });

  // State: dashboard tab
  const [activeTab, setActiveTab] = useState('moods'); // 'moods', 'games', 'suggested', 'blogs'

  // Blog posts (from API)
  const [blogPosts, setBlogPosts] = useState([]);
  // Fetch blog posts from API
  const fetchBlogPosts = async () => {
    const res = await fetch('/api/blog-posts');
    if (res.ok) {
      const data = await res.json();
      setBlogPosts(data);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchBlogPosts();
    }
  }, [authenticated]);
  const [blogForm, setBlogForm] = useState({ title: '', date: '', excerpt: '', image: '', slug: '', content: '', tags: '' });
  const [editingBlogIdx, setEditingBlogIdx] = useState(null);
  // Blog handlers
  const handleBlogFormChange = (e) => {
    setBlogForm({ ...blogForm, [e.target.name]: e.target.value });
  };
  // Blog CRUD handlers (API)
  const handleAddBlog = async (e) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.slug) return;
    // Split tags by comma, trim whitespace, filter out empty
    const tagsArr = blogForm.tags
      ? blogForm.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];
    const payload = { ...blogForm, tags: tagsArr };
    await fetch('/api/blog-posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setBlogForm({ title: '', date: '', excerpt: '', image: '', slug: '', content: '', tags: '' });
    fetchBlogPosts();
  };
  const startEditBlog = (idx) => {
    setEditingBlogIdx(idx);
    // Convert tags array to comma string for editing
    console.log('[startEditBlog] blogPosts:', blogPosts[idx]);
    setBlogForm({
      ...blogPosts[idx],
      date: blogPosts[idx].date?.slice(0, 10),
      tags: blogPosts[idx].blogTags
  ? blogPosts[idx].blogTags.map(t => t.blogTag.value).join(", ")
  : "",
    });
  };
  const saveEditBlog = async (idx) => {
    const post = blogPosts[idx];
    const tagsArr = blogForm.tags
      ? blogForm.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];
    const payload = { ...blogForm, tags: tagsArr };
    await fetch(`/api/blog-posts/${post.slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
                            <Image
                              src={game.image}
                              alt={game.name}
                              width={128}
                              height={80}
                              className="w-32 h-20 object-cover rounded"
                              sizes="128px"
                            />
    setBlogForm({ title: '', date: '', excerpt: '', image: '', slug: '', content: '', tags: '' });
    fetchBlogPosts();
  };
  const cancelEditBlog = () => {
    setEditingBlogIdx(null);
    setBlogForm({ title: '', date: '', excerpt: '', image: '', slug: '', content: '', tags: '' });
  };
  const deleteBlog = async (idx) => {
    const post = blogPosts[idx];
    await fetch(`/api/blog-posts/${post.slug}`, { method: 'DELETE' });
    fetchBlogPosts();
  };

  // State: suggested games
  const [suggestedGames, setSuggestedGames] = useState([]);

  // Demo password (replace in production)
  const ADMIN_PASSWORD = 'admin123';

  // Fetch moods from API
  const fetchMoods = async () => {
  const res = await fetch('/api/moods');
  const data = await res.json();
  setMoods(data);
  };

  // Fetch games from API
  const fetchGames = async () => {
    const res = await fetch('/api/games');
    const data = await res.json();
    setGames(data);
  };

  // On login, fetch games and suggested games
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      fetchGames();
      fetchSuggestedGames();
    } else {
      setError('Incorrect password');
    }
  };

  // Fetch suggested games from API
  const fetchSuggestedGames = async () => {
    const res = await fetch('/api/suggested-games');
    if (res.ok) {
      const data = await res.json();
      setSuggestedGames(data);
    } else {
      setSuggestedGames([]);
    }
  };

  // Fetch moods and suggested games when authenticated
  useEffect(() => {
    if (authenticated) {
      fetchMoods();
      fetchSuggestedGames();
    }
  }, [authenticated]);

  // Moods edit handlers
  const startMoodEdit = (mood) => {
    setMoodEditId(mood.id);
    setMoodEditValue(mood.mood);
  };
  const saveMoodEdit = async (id) => {
    await fetch(`/api/moods/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood: moodEditValue }),
    });
    setMoodEditId(null);
    fetchMoods();
  };
  const deleteMood = async (id) => {
    await fetch(`/api/moods/${id}`, { method: 'DELETE' });
    fetchMoods();
  };
  const cancelMoodEdit = () => setMoodEditId(null);

  // Tags edit handlers
  const startTagEdit = (tag) => {
    setTagEditId(tag.id);
    setTagEditValue(tag.value);
  };
  const saveTagEdit = async (id) => {
    await fetch(`/api/tags/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: tagEditValue }),
    });
    setTagEditId(null);
    fetchMoods();
  };
  const deleteTag = async (id) => {
    await fetch(`/api/tags/${id}`, { method: 'DELETE' });
    fetchMoods();
  };
  const cancelTagEdit = () => setTagEditId(null);

  // Add new tag handler
  const startAddTag = (moodId) => {
    setAddingTagMoodId(moodId);
    setNewTagValue('');
  };
  const saveNewTag = async (moodId) => {
    if (!newTagValue.trim()) return;
    await fetch(`/api/tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: newTagValue, moodId }),
    });
    setNewTagValue('');
    setAddingTagMoodId(null);
    fetchMoods();
  };
  const cancelAddTag = () => {
    setNewTagValue('');
    setAddingTagMoodId(null);
  };

  // Game form handlers
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleAddGame = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ name: '', mood: '', image: '', steamUrl: '', popularity: 0 });
      fetchGames();
    }
  };

  // Game edit handlers
  const startEdit = (game) => {
    setEditingId(game.id);
    setEditForm({ description: game.description || '', mood: game.mood || '' });
  };
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const saveEdit = async (id) => {
    await fetch(`/api/games/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    setEditingId(null);
    fetchGames();
  };
  const cancelEdit = () => setEditingId(null);

  // Delete game
  const handleDeleteGame = async (id) => {
    await fetch(`/api/games/${id}`, { method: 'DELETE' });
    fetchGames();
  };

  // Bulk upload handler
  const handleBulkUpload = async (e) => {
    setBulkUploadError('');
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const gamesArray = JSON.parse(text);
      if (!Array.isArray(gamesArray)) throw new Error('JSON must be an array of games');
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gamesArray),
      });
      if (res.ok) {
        fetchGames();
      } else {
        setBulkUploadError('Upload failed');
      }
    } catch (err) {
      setBulkUploadError('Invalid JSON file');
    }
  };

  // Render login if not authenticated
  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            name="password"
            placeholder="Enter admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded w-full">Login</button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    );
  }

  // Render dashboard with tabs
  const moodOptions = moods.map(mood => ({ id: mood.id, value: mood.mood }));
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      {/* Tabs */}
  <div className="flex flex-row gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'moods' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('moods')}
        >
          Moods & Tags
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'games' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('games')}
        >
          Games
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'suggested' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('suggested')}
        >
          Suggested Games
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'blogs' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('blogs')}
        >
          Blogs
        </button>
      
      </div>
      {/* Blogs Tab */}
      {activeTab === 'blogs' && (
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-2">Blog Posts</h3>
          <form onSubmit={editingBlogIdx !== null ? (e) => { e.preventDefault(); saveEditBlog(editingBlogIdx); } : handleAddBlog} className="mb-6 space-y-2">
            <input name="title" value={blogForm.title} onChange={handleBlogFormChange} placeholder="Title" className="border p-2 w-full" required />
            <input name="slug" value={blogForm.slug} onChange={handleBlogFormChange} placeholder="Slug (unique, e.g. my-post)" className="border p-2 w-full" required />
            <input name="date" type="date" value={blogForm.date} onChange={handleBlogFormChange} className="border p-2 w-full" />
            <input name="image" value={blogForm.image} onChange={handleBlogFormChange} placeholder="Image URL" className="border p-2 w-full" />
            <input name="excerpt" value={blogForm.excerpt} onChange={handleBlogFormChange} placeholder="Excerpt" className="border p-2 w-full" />
            <textarea name="content" value={blogForm.content} onChange={handleBlogFormChange} placeholder="Content" className="border p-2 w-full" rows={4} />
            <input name="tags" value={blogForm.tags} onChange={handleBlogFormChange} placeholder="Tags (comma separated)" className="border p-2 w-full" />
            <div className="flex gap-2">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">{editingBlogIdx !== null ? 'Save' : 'Add Blog'}</button>
              {editingBlogIdx !== null && (
                <button type="button" onClick={cancelEditBlog} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              )}
            </div>
          </form>
          <ul>
            {blogPosts.map((post, idx) => (
              <li key={idx} className="mb-6 border-b pb-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {post.image && (
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={128}
                      height={80}
                      className="w-32 h-20 object-cover rounded"
                      sizes="128px"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-indigo-700 text-lg">{post.title}</div>
                    <div className="text-xs text-gray-400 mb-1">{post.date}</div>
                    <div className="text-gray-700 mb-1">{post.excerpt}</div>
                    <div className="text-xs text-gray-400 mb-1">Slug: {post.slug}</div>
                    <div className="flex gap-2 mt-1">
                      <button onClick={() => startEditBlog(idx)} className="bg-blue-500 text-white px-2 py-1 rounded text-xs">Edit</button>
                      <button onClick={() => deleteBlog(idx)} className="bg-red-500 text-white px-2 py-1 rounded text-xs">Delete</button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Suggested Games Tab */}
      {activeTab === 'suggested' && (
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
      )}

      {/* Moods & Tags Tab */}
      {activeTab === 'moods' && (
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-2">Moods & Tags</h3>
          <ul>
            {moods.map(mood => (
              <li key={mood.id} className="mb-4 border-b pb-2">
                <div className="flex items-center gap-2">
                  {moodEditId === mood.id ? (
                    <>
                      <input value={moodEditValue} onChange={e => setMoodEditValue(e.target.value)} className="border p-1" />
                      <button onClick={() => saveMoodEdit(mood.id)} className="bg-green-500 text-white px-2 py-1 rounded">Save</button>
                      <button onClick={cancelMoodEdit} className="bg-gray-400 text-white px-2 py-1 rounded">Cancel</button>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-indigo-600">{mood.mood}</span>
                      <button onClick={() => startMoodEdit(mood)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                      <button onClick={() => deleteMood(mood.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                    </>
                  )}
                </div>
                {/* Show tags only when editing this mood */}
                {moodEditId === mood.id && (
                  <div className="ml-4 mt-2">
                    <span className="font-medium">Tags:</span>
                    <ul className="flex flex-col gap-2 mt-1">
                      {mood.tags.map(tag => (
                        <li key={tag.id} className="flex items-center gap-2">
                          {tagEditId === tag.id ? (
                            <>
                              <input value={tagEditValue} onChange={e => setTagEditValue(e.target.value)} className="border p-1" />
                              <button onClick={() => saveTagEdit(tag.id)} className="bg-green-500 text-white px-1 py-0.5 rounded text-xs">Save</button>
                              <button onClick={cancelTagEdit} className="bg-gray-400 text-white px-1 py-0.5 rounded text-xs">Cancel</button>
                            </>
                          ) : (
                            <>
                              <span className="bg-gray-200 px-2 py-0.5 rounded text-sm">{tag.value}</span>
                              <button onClick={() => startTagEdit(tag)} className="bg-blue-500 text-white px-1 py-0.5 rounded text-xs">Edit</button>
                              <button onClick={() => deleteTag(tag.id)} className="bg-red-500 text-white px-1 py-0.5 rounded text-xs">Delete</button>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                    {/* Add Tag Section */}
                    {addingTagMoodId === mood.id ? (
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          value={newTagValue}
                          onChange={e => setNewTagValue(e.target.value)}
                          className="border p-1"
                          placeholder="New tag value"
                        />
                        <button onClick={() => saveNewTag(mood.id)} className="bg-green-500 text-white px-2 py-1 rounded text-xs">Add</button>
                        <button onClick={cancelAddTag} className="bg-gray-400 text-white px-2 py-1 rounded text-xs">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => startAddTag(mood.id)} className="bg-indigo-500 text-white px-2 py-1 rounded text-xs mt-2">+ Add Tag</button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Games Tab */}
      {activeTab === 'games' && (
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
      )}
    </div>
  );
}
