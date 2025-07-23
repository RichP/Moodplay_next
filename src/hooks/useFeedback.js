import { useState } from 'react';
import { feedbackApi } from '../services/adminApi';

export function useFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all feedback
  const fetchFeedback = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await feedbackApi.getAll();
      setFeedback(data);
    } catch (err) {
      setError('Failed to load feedback');
      console.error('Error fetching feedback:', err);
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete feedback item
  const handleDeleteFeedback = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    
    setLoading(true);
    
    try {
      const result = await feedbackApi.delete(id);
      
      if (result.success) {
        // Remove from state without refetching
        setFeedback(prev => prev.filter(item => item.id !== id));
      } else {
        setError(result.error?.error || 'Failed to delete feedback');
        alert(`Failed to delete feedback: ${result.error?.error || 'Unknown error'}`);
      }
    } catch (err) {
      setError('Error deleting feedback');
      alert(`Error deleting feedback: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    feedback,
    loading,
    error,
    fetchFeedback,
    handleDeleteFeedback
  };
}
