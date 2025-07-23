// API service for admin data operations

// Base API configuration
const API_BASE = '/api';
const defaultHeaders = { 'Content-Type': 'application/json' };

// API paths
const API_PATHS = {
  games: `${API_BASE}/games`,
  moods: `${API_BASE}/moods`,
  tags: `${API_BASE}/tags`,
  blogs: `${API_BASE}/blog-posts`,
  feedback: `${API_BASE}/feedback`,
  suggestedGames: `${API_BASE}/suggested-games`
};

// Get authentication token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? {
    ...defaultHeaders,
    'Authorization': `Bearer ${token}`
  } : defaultHeaders;
};

// Generic error handler
const handleApiError = (error, customMessage = 'Operation failed') => {
  console.error(`${customMessage}:`, error);
  
  // Check if error is due to unauthorized access
  if (error.status === 401) {
    // Clear token and redirect to login
    localStorage.removeItem('authToken');
    window.location.reload();
    return { error: 'Session expired. Please login again.' };
  }
  
  return { error: error.message || 'Unknown error occurred' };
};

// Games API
export const gamesApi = {
  // Get all games
  getAll: async () => {
    try {
      const res = await fetch(API_PATHS.games, { cache: "no-store" });
      if (!res.ok) return [];
      return await res.json();
    } catch (err) {
      handleApiError(err, 'Failed to fetch games');
      return [];
    }
  },

  // Add a new game
  add: async (game) => {
    try {
      const res = await fetch(API_PATHS.games, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(game),
        cache: "no-store"
      });
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        return { success: false, error };
      }
      
      return { success: true, data: await res.json().catch(() => ({})) };
    } catch (err) {
      return { success: false, ...handleApiError(err, 'Failed to add game') };
    }
  },

  // Update a game
  update: async (id, data) => {
    try {
      const res = await fetch(`${API_PATHS.games}/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        return { success: false, error };
      }
      
      return { success: true };
    } catch (err) {
      return { success: false, ...handleApiError(err, 'Failed to update game') };
    }
  },

  // Delete a game
  delete: async (id) => {
    try {
      const res = await fetch(`${API_PATHS.games}/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        return { success: false, error };
      }
      
      return { success: true };
    } catch (err) {
      return { success: false, ...handleApiError(err, 'Failed to delete game') };
    }
  },

  // Bulk upload games
  bulkUpload: async (gamesArray) => {
    if (!Array.isArray(gamesArray)) {
      return { success: false, error: { error: 'Data must be an array of games' } };
    }
    
    try {
      const res = await fetch(API_PATHS.games, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(gamesArray),
        cache: "no-store"
      });
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        return { success: false, error };
      }
      
      return { success: true };
    } catch (err) {
      return { success: false, ...handleApiError(err, 'Failed to bulk upload games') };
    }
  }
};

// Moods API
export const moodsApi = {
  // Get all moods
  getAll: async () => {
    try {
      const res = await fetch(API_PATHS.moods, { cache: "no-store" });
      if (!res.ok) return [];
      return await res.json();
    } catch (err) {
      handleApiError(err, 'Failed to fetch moods');
      return [];
    }
  },

  // Update a mood
  update: async (id, data) => {
    try {
      const res = await fetch(`${API_PATHS.moods}/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        return { success: false, error };
      }
      
      return { success: true };
    } catch (err) {
      return { success: false, ...handleApiError(err, 'Failed to update mood') };
    }
  },

  // Delete a mood
  delete: async (id) => {
    try {
      const res = await fetch(`${API_PATHS.moods}/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        return { success: false, error };
      }
      
      return { success: true };
    } catch (err) {
      return { success: false, ...handleApiError(err, 'Failed to delete mood') };
    }
  }
};

// Tags API
export const tagsApi = {
  // Add a new tag
  add: async (tag) => {
    try {
      const res = await fetch(API_PATHS.tags, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(tag)
      });
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        return { success: false, error };
      }
      
      return { success: true };
    } catch (err) {
      return { success: false, ...handleApiError(err, 'Failed to add tag') };
    }
  },

  // Update a tag
  update: async (id, data) => {
    try {
      const res = await fetch(`${API_PATHS.tags}/${id}`, {
        method: 'PATCH',
        headers: defaultHeaders,
        body: JSON.stringify(data)
      });
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        return { success: false, error };
      }
      
      return { success: true };
    } catch (err) {
      return { success: false, ...handleApiError(err, 'Failed to update tag') };
    }
  },

  // Delete a tag
  delete: async (id) => {
    try {
      const res = await fetch(`${API_PATHS.tags}/${id}`, { 
        method: 'DELETE' 
      });
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        return { success: false, error };
      }
      
      return { success: true };
    } catch (err) {
      return { success: false, ...handleApiError(err, 'Failed to delete tag') };
    }
  }
};

// Blog posts API
export const blogsApi = {
  // Get all blog posts
  getAll: async () => {
    try {
      const res = await fetch(API_PATHS.blogs, { cache: "no-store" });
      if (!res.ok) return [];
      return await res.json();
    } catch (err) {
      handleApiError(err, 'Failed to fetch blog posts');
      return [];
    }
  }
};

// Feedback API
export const feedbackApi = {
  // Get all feedback
  getAll: async () => {
    try {
      const res = await fetch(API_PATHS.feedback, { cache: "no-store" });
      if (!res.ok) return [];
      return await res.json();
    } catch (err) {
      handleApiError(err, 'Failed to fetch feedback');
      return [];
    }
  },

  // Delete feedback
  delete: async (id) => {
    try {
      const res = await fetch(`${API_PATHS.feedback}/${id}`, { 
        method: 'DELETE' 
      });
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        return { success: false, error };
      }
      
      return { success: true };
    } catch (err) {
      return { success: false, ...handleApiError(err, 'Failed to delete feedback') };
    }
  }
};

// Suggested games API
export const suggestedGamesApi = {
  // Get all suggested games
  getAll: async () => {
    try {
      const res = await fetch(API_PATHS.suggestedGames, { cache: "no-store" });
      if (!res.ok) return [];
      return await res.json();
    } catch (err) {
      handleApiError(err, 'Failed to fetch suggested games');
      return [];
    }
  },

  // Delete a suggested game
  delete: async (id) => {
    try {
      const res = await fetch(`${API_PATHS.suggestedGames}/${id}`, { 
        method: 'DELETE' 
      });
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        return { success: false, error };
      }
      
      return { success: true };
    } catch (err) {
      return { success: false, ...handleApiError(err, 'Failed to delete suggested game') };
    }
  }
};
