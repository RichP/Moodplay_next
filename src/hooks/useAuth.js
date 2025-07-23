import { useState } from 'react';

// Custom hook for authentication state
export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Demo password (replace in production)
  const ADMIN_PASSWORD = 'admin123';

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      return true; // Authentication successful
    } else {
      setError('Incorrect password');
      return false; // Authentication failed
    }
  };
  
  return {
    authenticated,
    password,
    error,
    setPassword,
    handleLogin,
    setAuthenticated
  };
}
