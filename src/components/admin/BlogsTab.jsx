"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function BlogsTab({ blogPosts, fetchBlogPosts }) {
  const [blogForm, setBlogForm] = useState({ 
    title: '', 
    date: '', 
    excerpt: '', 
    image: '', 
    slug: '', 
    content: '', 
    tags: '' 
  });
  const [editingBlogIdx, setEditingBlogIdx] = useState(null);

  // Blog handlers
  const handleBlogFormChange = (e) => {
    setBlogForm({ ...blogForm, [e.target.name]: e.target.value });
  };

  // Blog CRUD handlers (API)
  const handleAddBlog = async (e) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.slug) return;
    
    // Ensure the date is valid - use current date if not provided or invalid
    let formattedDate = blogForm.date;
    if (!formattedDate || isNaN(new Date(formattedDate).getTime())) {
      formattedDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    }
    
    // Split tags by comma, trim whitespace, filter out empty
    const tagsArr = blogForm.tags
      ? blogForm.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];
    
    // Create a clean payload with only the necessary fields
    const payload = {
      title: blogForm.title.trim(),
      slug: blogForm.slug.trim(),
      date: formattedDate,
      excerpt: blogForm.excerpt || '',
      image: blogForm.image || '',
      content: blogForm.content || '',
      tags: tagsArr
    };
    
    console.log('Submitting blog post:', payload);
    
    try {
      const response = await fetch('/api/blog-posts', {
        cache: "no-store",
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to create blog post:', errorData);
        alert(`Failed to create blog post: ${errorData.error || 'Unknown error'}`);
        return;
      }
      
      setBlogForm({ title: '', date: '', excerpt: '', image: '', slug: '', content: '', tags: '' });
      fetchBlogPosts();
    } catch (error) {
      console.error('Error creating blog post:', error);
      alert(`Error creating blog post: ${error.message || 'Unknown error'}`);
    }
  };

  const startEditBlog = (idx) => {
    setEditingBlogIdx(idx);
    // Convert tags array to comma string for editing
    console.log('[startEditBlog] blogPosts:', blogPosts[idx]);
    setBlogForm({
      ...blogPosts[idx],
      date: blogPosts[idx].date?.slice(0, 10),
      tags: blogPosts[idx].blogTags
        ? blogPosts[idx].blogTags.map(t => t.blogTag.value).join(", ")
        : "",
    });
  };

  const saveEditBlog = async (idx) => {
    const post = blogPosts[idx];
    
    // Ensure the date is valid - use current date if not provided or invalid
    let formattedDate = blogForm.date;
    if (!formattedDate || isNaN(new Date(formattedDate).getTime())) {
      formattedDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    }
    
    const tagsArr = blogForm.tags
      ? blogForm.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];
      
    const payload = { ...blogForm, date: formattedDate, tags: tagsArr };
    console.log('Updating blog post:', payload);
    
    try {
      const response = await fetch(`/api/blog-posts/${post.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to update blog post:', errorData);
        alert('Failed to update blog post. Please check the form data.');
        return;
      }
      
      setBlogForm({ title: '', date: '', excerpt: '', image: '', slug: '', content: '', tags: '' });
      setEditingBlogIdx(null);
      fetchBlogPosts();
    } catch (error) {
      console.error('Error updating blog post:', error);
      alert('An error occurred while updating the blog post.');
    }
  };

  const cancelEditBlog = () => {
    setEditingBlogIdx(null);
    setBlogForm({ title: '', date: '', excerpt: '', image: '', slug: '', content: '', tags: '' });
  };

  const deleteBlog = async (idx) => {
    const post = blogPosts[idx];
    try {
      const response = await fetch(`/api/blog-posts/${post.slug}`, { method: 'DELETE' });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to delete blog post:', errorData);
        alert(`Failed to delete blog post: ${errorData.error || 'Unknown error'}`);
        return;
      }
      
      fetchBlogPosts();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      alert(`Error deleting blog post: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="mb-10">
      <h3 className="text-lg font-semibold mb-2">Blog Posts</h3>
      <form onSubmit={editingBlogIdx !== null ? (e) => { e.preventDefault(); saveEditBlog(editingBlogIdx); } : handleAddBlog} className="mb-6 space-y-2">
        <input name="title" value={blogForm.title} onChange={handleBlogFormChange} placeholder="Title" className="border p-2 w-full" required />
        <input name="slug" value={blogForm.slug} onChange={handleBlogFormChange} placeholder="Slug (unique, e.g. my-post)" className="border p-2 w-full" required />
        <input 
          name="date" 
          type="date" 
          value={blogForm.date} 
          onChange={handleBlogFormChange} 
          className="border p-2 w-full" 
          placeholder="YYYY-MM-DD" 
          pattern="\d{4}-\d{2}-\d{2}"
          title="Enter a date in the format YYYY-MM-DD"
        />
        <input name="image" value={blogForm.image} onChange={handleBlogFormChange} placeholder="Image URL" className="border p-2 w-full" />
        <input name="excerpt" value={blogForm.excerpt} onChange={handleBlogFormChange} placeholder="Excerpt" className="border p-2 w-full" />
        <textarea name="content" value={blogForm.content} onChange={handleBlogFormChange} placeholder="Content" className="border p-2 w-full" rows={4} />
        <input name="tags" value={blogForm.tags} onChange={handleBlogFormChange} placeholder="Tags (comma separated)" className="border p-2 w-full" />
        <div className="flex gap-2">
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">{editingBlogIdx !== null ? 'Save' : 'Add Blog'}</button>
          {editingBlogIdx !== null && (
            <button type="button" onClick={cancelEditBlog} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
          )}
        </div>
      </form>
      <ul>
        {blogPosts.map((post, idx) => (
          <li key={idx} className="mb-6 border-b pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {post.image && (
                <Image
                  src={post.image}
                  alt={post.title}
                  width={128}
                  height={80}
                  className="w-32 h-20 object-cover rounded"
                  sizes="128px"
                />
              )}
              <div className="flex-1">
                <div className="font-semibold text-indigo-700 text-lg">{post.title}</div>
                <div className="text-xs text-gray-400 mb-1">{post.date}</div>
                <div className="text-gray-700 mb-1">{post.excerpt}</div>
                <div className="text-xs text-gray-400 mb-1">Slug: {post.slug}</div>
                <div className="flex gap-2 mt-1">
                  <button onClick={() => startEditBlog(idx)} className="bg-blue-500 text-white px-2 py-1 rounded text-xs">Edit</button>
                  <button onClick={() => deleteBlog(idx)} className="bg-red-500 text-white px-2 py-1 rounded text-xs">Delete</button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
