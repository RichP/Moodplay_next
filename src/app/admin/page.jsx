"use client";
import { useEffect } from 'react';

// Components
import TabNavigation from '@/components/admin/TabNavigation';
import LoginForm from '@/components/admin/LoginForm';
import BlogsTab from '@/components/admin/BlogsTab';
import SuggestedGamesTab from '@/components/admin/SuggestedGamesTab';
import MoodsTagsTab from '@/components/admin/MoodsTagsTab';
import FeedbackTab from '@/components/admin/FeedbackTab';
import GamesTab from '@/components/admin/GamesTab';

// Custom Hooks
import { useAuth } from '@/hooks/useAuth';
import { useTabs } from '@/hooks/useTabs';
import { useGames } from '@/hooks/useGames';
import { useMoodsAndTags } from '@/hooks/useMoodsAndTags';
import { useBlogs } from '@/hooks/useBlogs';
import { useFeedback } from '@/hooks/useFeedback';
import { useSuggestedGames } from '@/hooks/useSuggestedGames';


export default function AdminPage() {
  // Use custom hooks for state management
  const { 
    authenticated,
    username,
    password, 
    error: authError,
    loading: authLoading,
    setUsername,
    setPassword, 
    handleLogin,
    handleLogout,
    checkAuthStatus
  } = useAuth();
  
  const { 
    activeTab, 
    setActiveTab, 
    tabs 
  } = useTabs('moods');
  
  const { 
    games, 
    form, 
    filter, 
    editingId, 
    editForm, 
    bulkUploadError, 
    fetchGames, 
    handleChange, 
    handleAddGame, 
    startEdit, 
    handleEditChange, 
    saveEdit, 
    cancelEdit, 
    handleDeleteGame, 
    handleBulkUpload, 
    setFilter 
  } = useGames();
  
  const { 
    moods, 
    moodEditId, 
    moodEditValue, 
    tagEditId, 
    tagEditValue, 
    newTagValue, 
    addingTagMoodId, 
    fetchMoods, 
    startMoodEdit, 
    saveMoodEdit, 
    deleteMood, 
    cancelMoodEdit, 
    startTagEdit, 
    saveTagEdit, 
    deleteTag, 
    cancelTagEdit, 
    startAddTag, 
    saveNewTag, 
    cancelAddTag, 
    setMoodEditValue, 
    setTagEditValue, 
    setNewTagValue, 
    getMoodOptions 
  } = useMoodsAndTags();
  
  const { 
    blogPosts, 
    fetchBlogPosts 
  } = useBlogs();
  
  const { 
    feedback, 
    loading: loadingFeedback, 
    fetchFeedback, 
    handleDeleteFeedback 
  } = useFeedback();
  
  const { 
    suggestedGames, 
    acceptingSuggestion, 
    acceptForm, 
    fetchSuggestedGames, 
    handleDiscardSuggestion, 
    handleAcceptSuggestion, 
    handleAcceptFormChange, 
    handleAcceptFormSubmit, 
    handleCancelAccept 
  } = useSuggestedGames();

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);
  
  // Load data when authenticated and tab changes
  useEffect(() => {
    if (authenticated) {
      // Load initial data
      fetchGames();
      fetchMoods();
      fetchSuggestedGames();
      
      // Load data specific to active tab
      if (activeTab === 'blogs') {
        fetchBlogPosts();
      } else if (activeTab === 'feedback') {
        fetchFeedback();
      }
    }
  }, [authenticated, activeTab]);
  
  // Handle acceptance of suggested game
  const handleSuggestionAccept = (e) => {
    handleAcceptFormSubmit(e, fetchGames);
  };

  // Render login if not authenticated
  if (!authenticated) {
    return (
      <LoginForm
        username={username}
        password={password}
        error={authError}
        loading={authLoading}
        setUsername={setUsername}
        setPassword={setPassword}
        handleLogin={handleLogin}
      />
    );
  }

  // Get mood options for dropdowns
  const moodOptions = getMoodOptions();
  
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <button 
          onClick={handleLogout}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
        >
          Logout
        </button>
      </div>
      
      {/* Tab Navigation */}
      <TabNavigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        tabs={tabs}
      />

      {/* Blogs Tab */}
      {activeTab === 'blogs' && (
        <BlogsTab 
          blogPosts={blogPosts} 
          fetchBlogPosts={fetchBlogPosts} 
        />
      )}

      {/* Suggested Games Tab */}
      {activeTab === 'suggested' && (
        <SuggestedGamesTab 
          suggestedGames={suggestedGames} 
          moodOptions={moodOptions} 
          acceptingSuggestion={acceptingSuggestion}
          acceptForm={acceptForm}
          handleDiscardSuggestion={handleDiscardSuggestion}
          handleAcceptSuggestion={handleAcceptSuggestion}
          handleAcceptFormChange={handleAcceptFormChange}
          handleAcceptFormSubmit={handleSuggestionAccept}
          handleCancelAccept={handleCancelAccept}
          fetchSuggestedGames={fetchSuggestedGames}
        />
      )}

      {/* Moods & Tags Tab */}
      {activeTab === 'moods' && (
        <MoodsTagsTab 
          moods={moods}
          moodEditId={moodEditId}
          moodEditValue={moodEditValue}
          tagEditId={tagEditId}
          tagEditValue={tagEditValue}
          addingTagMoodId={addingTagMoodId}
          newTagValue={newTagValue}
          setMoodEditValue={setMoodEditValue}
          saveMoodEdit={saveMoodEdit}
          cancelMoodEdit={cancelMoodEdit}
          startMoodEdit={startMoodEdit}
          deleteMood={deleteMood}
          setTagEditValue={setTagEditValue}
          saveTagEdit={saveTagEdit}
          cancelTagEdit={cancelTagEdit}
          startTagEdit={startTagEdit}
          deleteTag={deleteTag}
          setNewTagValue={setNewTagValue}
          saveNewTag={saveNewTag}
          cancelAddTag={cancelAddTag}
          startAddTag={startAddTag}
          fetchMoods={fetchMoods}
        />
      )}

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <FeedbackTab 
          feedback={feedback}
          loadingFeedback={loadingFeedback}
          handleDeleteFeedback={handleDeleteFeedback}
        />
      )}

      {/* Games Tab */}
      {activeTab === 'games' && (
        <GamesTab 
          games={games}
          form={form}
          filter={filter}
          editingId={editingId}
          editForm={editForm}
          moodOptions={moodOptions}
          bulkUploadError={bulkUploadError}
          handleChange={handleChange}
          handleAddGame={handleAddGame}
          startEdit={startEdit}
          handleEditChange={handleEditChange}
          saveEdit={saveEdit}
          cancelEdit={cancelEdit}
          handleDeleteGame={handleDeleteGame}
          handleBulkUpload={handleBulkUpload}
          setFilter={setFilter}
        />
      )}
    </div>
  );
}
