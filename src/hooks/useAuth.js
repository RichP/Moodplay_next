import { useState } from 'react';

// Custom hook for authentication state
export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Use the JWT API endpoint for authentication
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store the token in localStorage
        localStorage.setItem('authToken', data.token);
        setAuthenticated(true);
        setLoading(false);
        return true; // Authentication successful
      } else {
        setError(data.error || 'Authentication failed');
        setLoading(false);
        return false; // Authentication failed
      }
    } catch (err) {
      setError('Login error: ' + (err.message || 'Unknown error'));
      setLoading(false);
      return false;
    }
  };
  
  // Check for existing token on component mount
  const checkAuthStatus = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Validate token with backend
      fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.valid) {
          setAuthenticated(true);
        } else {
          // Token invalid or expired, clear it
          localStorage.removeItem('authToken');
          setAuthenticated(false);
        }
      })
      .catch(() => {
        // Error checking token, clear it to be safe
        localStorage.removeItem('authToken');
        setAuthenticated(false);
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setAuthenticated(false);
    setUsername('admin');
    setPassword('');
  };

  // Get the auth token for API requests
  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };
  
  return {
    authenticated,
    username,
    password,
    error,
    loading,
    setUsername,
    setPassword,
    handleLogin,
    handleLogout,
    checkAuthStatus,
    getAuthToken
  };
}
