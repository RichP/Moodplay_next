import { useState } from 'react';
import { blogsApi } from '../services/adminApi';

export function useBlogs() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all blog posts
  const fetchBlogPosts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await blogsApi.getAll();
      setBlogPosts(data);
    } catch (err) {
      setError('Failed to load blog posts');
      console.error('Error fetching blog posts:', err);
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    blogPosts,
    loading,
    error,
    fetchBlogPosts
  };
}
