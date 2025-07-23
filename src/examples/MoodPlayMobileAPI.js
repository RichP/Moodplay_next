// MoodPlayAPI.js - Sample React Native API client

import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure your API URL
const API_URL = 'https://moodplay.vercel.app/api';  // Replace with your actual URL

/**
 * MoodPlay API Client for mobile applications
 */
export class MoodPlayAPI {
  constructor() {
    this.token = null;
  }

  /**
   * Initialize the API client by loading the saved token
   */
  async init() {
    try {
      const token = await AsyncStorage.getItem('moodplay_token');
      if (token) {
        this.token = token;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error initializing API client:', error);
      return false;
    }
  }

  /**
   * Get authorization headers for authenticated requests
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  /**
   * Handle API responses and errors consistently
   */
  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      throw {
        status: response.status,
        ...data
      };
    }
    
    return data;
  }

  /**
   * Login to the API and store the token
   */
  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await this.handleResponse(response);
      
      if (data.token) {
        this.token = data.token;
        await AsyncStorage.setItem('moodplay_token', data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Logout and remove the stored token
   */
  async logout() {
    try {
      this.token = null;
      await AsyncStorage.removeItem('moodplay_token');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }

  /**
   * Check if the user is authenticated
   */
  isAuthenticated() {
    return !!this.token;
  }

  /**
   * Get all games
   */
  async getGames(filters = {}) {
    try {
      let url = `${API_URL}/games`;
      
      // Add query parameters if filters are provided
      const queryParams = new URLSearchParams();
      if (filters.selectedMood) queryParams.append('selectedMood', filters.selectedMood);
      if (filters.slug) queryParams.append('slug', filters.slug);
      if (filters.ids) queryParams.append('ids', filters.ids.join(','));
      
      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error getting games:', error);
      throw error;
    }
  }
  
  /**
   * Get all moods
   */
  async getMoods() {
    try {
      const response = await fetch(`${API_URL}/moods`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error getting moods:', error);
      throw error;
    }
  }
  
  /**
   * Submit feedback
   */
  async submitFeedback(feedback) {
    try {
      const response = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(feedback),
      });
      
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  }
  
  /**
   * Suggest a game
   */
  async suggestGame(gameData) {
    try {
      const response = await fetch(`${API_URL}/suggested-games`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(gameData),
      });
      
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error suggesting game:', error);
      throw error;
    }
  }
  
  /**
   * Get blog posts
   */
  async getBlogPosts() {
    try {
      const response = await fetch(`${API_URL}/blog-posts`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error getting blog posts:', error);
      throw error;
    }
  }
  
  /**
   * Admin only: Create a new game
   * Requires authentication with admin privileges
   */
  async createGame(gameData) {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required');
    }
    
    try {
      const response = await fetch(`${API_URL}/games`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(gameData),
      });
      
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  }
  
  /**
   * Admin only: Update a game
   * Requires authentication with admin privileges
   */
  async updateGame(id, gameData) {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required');
    }
    
    try {
      const response = await fetch(`${API_URL}/games?id=${id}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(gameData),
      });
      
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error updating game:', error);
      throw error;
    }
  }
  
  /**
   * Admin only: Delete a game
   * Requires authentication with admin privileges
   */
  async deleteGame(id) {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required');
    }
    
    try {
      const response = await fetch(`${API_URL}/games?id=${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error deleting game:', error);
      throw error;
    }
  }
}
