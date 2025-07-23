import { useState } from 'react';
import { moodsApi, tagsApi } from '../services/adminApi';

export function useMoodsAndTags() {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Mood editing state
  const [moodEditId, setMoodEditId] = useState(null);
  const [moodEditValue, setMoodEditValue] = useState('');
  
  // Tag editing state
  const [tagEditId, setTagEditId] = useState(null);
  const [tagEditValue, setTagEditValue] = useState('');
  const [newTagValue, setNewTagValue] = useState('');
  const [addingTagMoodId, setAddingTagMoodId] = useState(null);

  // Fetch all moods
  const fetchMoods = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await moodsApi.getAll();
      setMoods(data);
    } catch (err) {
      setError('Failed to load moods');
      console.error('Error fetching moods:', err);
      setMoods([]);
    } finally {
      setLoading(false);
    }
  };

  // Start editing a mood
  const startMoodEdit = (mood) => {
    setMoodEditId(mood.id);
    setMoodEditValue(mood.mood);
  };

  // Save edited mood
  const saveMoodEdit = async (id) => {
    setLoading(true);
    
    try {
      const result = await moodsApi.update(id, { mood: moodEditValue });
      
      if (result.success) {
        setMoodEditId(null);
        fetchMoods();
      } else {
        setError(result.error?.error || 'Failed to update mood');
        alert(`Failed to update mood: ${result.error?.error || 'Unknown error'}`);
      }
    } catch (err) {
      setError('Error updating mood');
      alert(`Error updating mood: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete a mood
  const deleteMood = async (id) => {
    if (!window.confirm('Are you sure you want to delete this mood? This will affect all games with this mood.')) {
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await moodsApi.delete(id);
      
      if (result.success) {
        fetchMoods();
      } else {
        setError(result.error?.error || 'Failed to delete mood');
        alert(`Failed to delete mood: ${result.error?.error || 'Unknown error'}`);
      }
    } catch (err) {
      setError('Error deleting mood');
      alert(`Error deleting mood: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Cancel mood editing
  const cancelMoodEdit = () => setMoodEditId(null);

  // Start editing a tag
  const startTagEdit = (tag) => {
    setTagEditId(tag.id);
    setTagEditValue(tag.value);
  };

  // Save edited tag
  const saveTagEdit = async (id) => {
    setLoading(true);
    
    try {
      const result = await tagsApi.update(id, { value: tagEditValue });
      
      if (result.success) {
        setTagEditId(null);
        fetchMoods();
      } else {
        setError(result.error?.error || 'Failed to update tag');
        alert(`Failed to update tag: ${result.error?.error || 'Unknown error'}`);
      }
    } catch (err) {
      setError('Error updating tag');
      alert(`Error updating tag: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete a tag
  const deleteTag = async (id) => {
    setLoading(true);
    
    try {
      const result = await tagsApi.delete(id);
      
      if (result.success) {
        fetchMoods();
      } else {
        setError(result.error?.error || 'Failed to delete tag');
        alert(`Failed to delete tag: ${result.error?.error || 'Unknown error'}`);
      }
    } catch (err) {
      setError('Error deleting tag');
      alert(`Error deleting tag: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Cancel tag editing
  const cancelTagEdit = () => setTagEditId(null);

  // Start adding a new tag
  const startAddTag = (moodId) => {
    setAddingTagMoodId(moodId);
    setNewTagValue('');
  };

  // Save new tag
  const saveNewTag = async (moodId) => {
    if (!newTagValue.trim()) return;
    
    setLoading(true);
    
    try {
      const result = await tagsApi.add({ value: newTagValue, moodId });
      
      if (result.success) {
        setNewTagValue('');
        setAddingTagMoodId(null);
        fetchMoods();
      } else {
        setError(result.error?.error || 'Failed to add tag');
        alert(`Failed to add tag: ${result.error?.error || 'Unknown error'}`);
      }
    } catch (err) {
      setError('Error adding tag');
      alert(`Error adding tag: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Cancel adding a tag
  const cancelAddTag = () => {
    setNewTagValue('');
    setAddingTagMoodId(null);
  };

  // Get options for dropdown menus
  const getMoodOptions = () => {
    return moods.map(mood => ({ id: mood.id, value: mood.mood }));
  };

  return {
    moods,
    loading,
    error,
    moodEditId,
    moodEditValue,
    tagEditId,
    tagEditValue,
    newTagValue,
    addingTagMoodId,
    fetchMoods,
    startMoodEdit,
    saveMoodEdit,
    deleteMood,
    cancelMoodEdit,
    startTagEdit,
    saveTagEdit,
    deleteTag,
    cancelTagEdit,
    startAddTag,
    saveNewTag,
    cancelAddTag,
    setMoodEditValue,
    setTagEditValue,
    setNewTagValue,
    getMoodOptions
  };
}
