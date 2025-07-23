import { useState } from 'react';
import { gamesApi } from '../services/adminApi';

export function useGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form state for adding/editing games
  const [form, setForm] = useState({ name: '', mood: '', image: '', steamUrl: '', popularity: 0 });
  const [filter, setFilter] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ description: '', mood: '' });
  const [bulkUploadError, setBulkUploadError] = useState('');

  // Fetch all games
  const fetchGames = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await gamesApi.getAll();
      setGames(data);
    } catch (err) {
      setError('Failed to load games');
      console.error('Error fetching games:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form change for adding a new game
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add a new game
  const handleAddGame = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await gamesApi.add(form);
      
      if (result.success) {
        setForm({ name: '', mood: '', image: '', steamUrl: '', popularity: 0 });
        fetchGames();
      } else {
        setError(result.error?.error || 'Failed to add game');
        alert(`Failed to add game: ${result.error?.error || 'Unknown error'}`);
      }
    } catch (err) {
      setError('Error adding game');
      alert(`Error adding game: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Start editing a game
  const startEdit = (game) => {
    setEditingId(game.id);
    setEditForm({ description: game.description || '', mood: game.mood || '' });
  };

  // Handle form change for editing a game
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Save edited game
  const saveEdit = async (id) => {
    setLoading(true);
    
    try {
      const result = await gamesApi.update(id, editForm);
      
      if (result.success) {
        setEditingId(null);
        fetchGames();
      } else {
        setError(result.error?.error || 'Failed to update game');
        alert(`Failed to update game: ${result.error?.error || 'Unknown error'}`);
      }
    } catch (err) {
      setError('Error updating game');
      alert(`Error updating game: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const cancelEdit = () => setEditingId(null);

  // Delete a game
  const handleDeleteGame = async (id) => {
    if (!window.confirm('Are you sure you want to delete this game?')) {
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await gamesApi.delete(id);
      
      if (result.success) {
        fetchGames();
      } else {
        setError(result.error?.error || 'Failed to delete game');
        alert(`Failed to delete game: ${result.error?.error || 'Unknown error'}`);
      }
    } catch (err) {
      setError('Error deleting game');
      alert(`Error deleting game: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Bulk upload games
  const handleBulkUpload = async (e) => {
    setBulkUploadError('');
    const file = e.target.files[0];
    if (!file) return;
    
    setLoading(true);
    
    try {
      const text = await file.text();
      const gamesArray = JSON.parse(text);
      
      const result = await gamesApi.bulkUpload(gamesArray);
      
      if (result.success) {
        fetchGames();
      } else {
        setBulkUploadError(result.error?.error || 'Upload failed');
      }
    } catch (err) {
      setBulkUploadError(`Invalid JSON file: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    games,
    loading,
    error,
    form,
    filter,
    editingId,
    editForm,
    bulkUploadError,
    fetchGames,
    handleChange,
    handleAddGame,
    startEdit,
    handleEditChange,
    saveEdit,
    cancelEdit,
    handleDeleteGame,
    handleBulkUpload,
    setFilter,
    setBulkUploadError
  };
}
