import React from "react";

export default function SearchBarComponent({ searchTerm, setSearchTerm }) {
  return (
    <div className="w-full">
      <div className="relative w-full max-w-xs sm:max-w-md lg:max-w-lg">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search games..."
          className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:bg-gray-50"
          aria-label="Search games"
        />

        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M20 20l-4-4" />
          </svg>
        </span>
      </div>
    </div>
  );
}
