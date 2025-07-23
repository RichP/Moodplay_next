import React from 'react';

export default function LoginForm({ username, password, error, loading, setUsername, setPassword, handleLogin }) {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Admin Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="border p-2 w-full rounded"
            autoComplete="username"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border p-2 w-full rounded"
            autoComplete="current-password"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className={`${
            loading ? 'bg-indigo-300' : 'bg-indigo-500 hover:bg-indigo-600'
          } text-white px-4 py-2 rounded w-full transition`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
