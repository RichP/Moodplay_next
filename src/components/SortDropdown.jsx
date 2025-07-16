export default function SortDropdown({ sortOption, setSortOption }) {
  return (
    <div className="mb-4 flex justify-center">
      <div className="relative w-full max-w-xs sm:max-w-md lg:max-w-lg">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          aria-label="Sort games"
        >
          <option value="name-asc">Name (A–Z)</option>
          <option value="name-desc">Name (Z–A)</option>
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </div>
  );
}

