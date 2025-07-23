import { useState } from 'react';
import { suggestedGamesApi, gamesApi } from '../services/adminApi';

export function useSuggestedGames() {
  const [suggestedGames, setSuggestedGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for accepting a suggestion
  const [acceptingSuggestion, setAcceptingSuggestion] = useState(null);
  const [acceptForm, setAcceptForm] = useState({ name: '', mood: '', description: '', image: '', steamUrl: '', popularity: 0 });

  // Fetch all suggested games
  const fetchSuggestedGames = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await suggestedGamesApi.getAll();
      setSuggestedGames(data);
    } catch (err) {
      setError('Failed to load suggested games');
      console.error('Error fetching suggested games:', err);
      setSuggestedGames([]);
    } finally {
      setLoading(false);
    }
  };

  // Discard suggested game
  const handleDiscardSuggestion = async (id) => {
    setLoading(true);
    
    try {
      const result = await suggestedGamesApi.delete(id);
      
      if (result.success) {
        fetchSuggestedGames();
      } else {
        setError(result.error?.error || 'Failed to discard suggestion');
        alert(`Failed to discard suggestion: ${result.error?.error || 'Unknown error'}`);
      }
    } catch (err) {
      setError('Error discarding suggestion');
      alert(`Error discarding suggestion: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
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
  const handleAcceptFormSubmit = async (e, onGameCreated) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create new game
      const gameResult = await gamesApi.add(acceptForm);
      
      if (!gameResult.success) {
        setError(gameResult.error?.error || 'Failed to create game from suggestion');
        alert(`Failed to create game: ${gameResult.error?.error || 'Unknown error'}`);
        setLoading(false);
        return;
      }
      
      // If game created successfully, delete the suggestion
      const deleteResult = await suggestedGamesApi.delete(acceptingSuggestion);
      
      if (!deleteResult.success) {
        // Game was created but suggestion wasn't deleted
        console.warn('Game created but failed to delete suggestion:', deleteResult.error);
      }
      
      setAcceptingSuggestion(null);
      
      // Call the callback to refresh games list
      if (onGameCreated) {
        onGameCreated();
      }
      
      fetchSuggestedGames();
    } catch (err) {
      setError('Error processing suggestion');
      alert(`Error processing suggestion: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Cancel accepting a suggestion
  const handleCancelAccept = () => {
    setAcceptingSuggestion(null);
  };

  return {
    suggestedGames,
    loading,
    error,
    acceptingSuggestion,
    acceptForm,
    fetchSuggestedGames,
    handleDiscardSuggestion,
    handleAcceptSuggestion,
    handleAcceptFormChange,
    handleAcceptFormSubmit,
    handleCancelAccept
  };
}
