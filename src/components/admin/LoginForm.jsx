import React from 'react';

export default function LoginForm({ password, error, setPassword, handleLogin }) {
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
          autoComplete="current-password"
        />
        <button 
          type="submit" 
          className="bg-indigo-500 text-white px-4 py-2 rounded w-full hover:bg-indigo-600 transition"
        >
          Login
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
