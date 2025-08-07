/**
 * Papers API Service
 * Handles all API calls related to research papers functionality
 */

import { fetchWithAuth } from './api';

// Papers API functions
const papersAPI = {
  // Get all papers with optional filtering
  getAllPapers: async (category?: string, page = 1, limit = 10) => {
    let url = `/api/papers?page=${page}&limit=${limit}`;
    if (category && category !== 'all') {
      url += `&category=${encodeURIComponent(category)}`;
    }
    return fetchWithAuth(url);
  },

  // Get a single paper by ID
  getPaperById: async (id: string) => {
    return fetchWithAuth(`/api/papers/${id}`);
  },

  // Create a new paper (with file upload)
  createPaper: async (formData: FormData) => {
    return fetchWithAuth('/api/papers', {
      method: 'POST',
      headers: {
        // Don't set Content-Type here, it will be set automatically with the correct boundary
      },
      body: formData,
    });
  },

  // Update an existing paper
  updatePaper: async (id: string, formData: FormData) => {
    return fetchWithAuth(`/api/papers/${id}`, {
      method: 'PUT',
      headers: {
        // Don't set Content-Type here, it will be set automatically with the correct boundary
      },
      body: formData,
    });
  },

  // Delete a paper
  deletePaper: async (id: string) => {
    return fetchWithAuth(`/api/papers/${id}`, {
      method: 'DELETE',
    });
  },

  // Get download URL for a paper
  getDownloadUrl: (id: string) => {
    return `/api/papers/${id}/download`;
  },

  // Sync papers with external source (if needed)
  syncPapers: async () => {
    return fetchWithAuth('/api/papers/sync', {
      method: 'POST',
    });
  },
};

export default papersAPI;