import { useState } from 'react';

// Custom hook for tab management
export function useTabs(initialTab) {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const tabs = [
    { id: 'moods', label: 'Moods & Tags' },
    { id: 'games', label: 'Games' },
    { id: 'suggested', label: 'Suggested Games' },
    { id: 'blogs', label: 'Blogs' },
    { id: 'feedback', label: 'Feedback' }
  ];
  
  return {
    activeTab,
    setActiveTab,
    tabs
  };
}
