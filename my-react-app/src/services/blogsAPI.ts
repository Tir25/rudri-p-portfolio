/**
 * Blog API Service
 * Handles all API calls related to blog functionality
 */

import { fetchWithAuth } from './api';

// Blog API functions
const blogsAPI = {
  // Get all blogs with pagination
  getAllBlogs: async (page = 1, limit = 10) => {
    return fetchWithAuth(`/api/blogs?page=${page}&limit=${limit}`);
  },

  // Get a single blog by ID
  getBlogById: async (id: string) => {
    return fetchWithAuth(`/api/blogs/${id}`);
  },

  // Create a new blog
  createBlog: async (blogData: Record<string, unknown>) => {
    return fetchWithAuth('/api/blogs', {
      method: 'POST',
      body: JSON.stringify(blogData),
    });
  },

  // Update an existing blog
  updateBlog: async (id: string, blogData: Record<string, unknown>) => {
    return fetchWithAuth(`/api/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(blogData),
    });
  },

  // Delete a blog
  deleteBlog: async (id: string) => {
    return fetchWithAuth(`/api/blogs/${id}`, {
      method: 'DELETE',
    });
  },

  // Upload a blog image
  uploadBlogImage: async (formData: FormData) => {
    return fetchWithAuth('/api/blogs/upload-image', {
      method: 'POST',
      body: formData,
    });
  },
};

export default blogsAPI;