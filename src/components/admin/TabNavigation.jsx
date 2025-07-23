import React from 'react';

export default function TabNavigation({ activeTab, setActiveTab, tabs }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`px-4 py-2 rounded ${
            activeTab === tab.id 
              ? 'bg-indigo-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
