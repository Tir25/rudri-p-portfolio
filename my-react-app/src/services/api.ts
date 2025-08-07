/**
 * API service module for making requests to the backend
 * This centralizes all API calls and handles common functionality like:
 * - Setting the base URL
 * - Adding authentication headers
 * - Error handling
 * - Response parsing
 */

import config from '../config';

// API base URL from configuration
const API_BASE_URL = config.api.baseUrl;

// Add a function to check if the user is authenticated by cookie
async function checkAuthCookie(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: 'GET',
      credentials: 'include',
    });
    
    return response.status === 200;
  } catch {
    return false;
  }
}

// Generic fetch function with error handling
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // For debugging
  if (config.dev.debug) {
    console.log(`Making API request to: ${API_BASE_URL}${endpoint}`);
  }
  
  // Get stored auth token if available (as a fallback if cookies don't work)
  let authToken: string | null = null;
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.token) {
        authToken = user.token;
      }
    }
  } catch (e) {
    console.warn('Error accessing localStorage:', e);
  }

  // Set default headers if not provided
  const headers = {
    // Don't set Content-Type for FormData, let the browser set it with boundary
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    // Add Authorization header if we have a token
    ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
    ...options.headers,
  };

  // Always include credentials for cookies
  const requestConfig: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Important for JWT cookies
    mode: 'cors', // Explicitly set CORS mode
  };
  
  if (config.dev.debug) {
    console.log('Request config:', { endpoint, headers: requestConfig.headers, method: options.method });
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestConfig);
    
    // For non-JSON responses (like file downloads)
    if (options.headers && (options.headers as Record<string, string>).Accept !== 'application/json') {
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return response;
    }

    // For JSON responses
    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error('Failed to parse JSON response:', e);
      throw new Error(`API error: ${response.status} - Failed to parse response`);
    }
    
    // Log the response for debugging
    if (config.dev.debug) {
      console.log(`API response (${response.status}):`, data);
    }
    
    if (!response.ok) {
      const errorMessage = data.error || data.message || `API error: ${response.status}`;
      console.error('API request failed with status', response.status, errorMessage);
      throw new Error(errorMessage);
    }
    
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Auth API functions
const authAPI = {
  // Login with email and password
  login: async (email: string, password: string) => {
    const response = await fetchWithAuth('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // The backend returns {message: string, user: object, token: string}
    // Make sure we handle this correctly
    if (response && response.user) {
      return response; // Return the whole response with message, user, and token
    } else {
      // If response doesn't have expected format, log it and return as is
      console.warn('Unexpected API login response format:', response);
      return response;
    }
  },

  // Logout the current user
  logout: async () => {
    return fetchWithAuth('/api/auth/logout', {
      method: 'POST',
    });
  },

  // Get the current user's profile
  getProfile: async () => {
    try {
      const response = await fetchWithAuth('/api/auth/profile');
      if (config.dev.debug) {
        console.log('Profile API response:', response);
      }
      return response.user || response;
    } catch (error) {
      console.error('Failed to get profile:', error);
      throw error;
    }
  },

  // Register a new user (admin only)
  register: async (userData: Record<string, unknown>) => {
    return fetchWithAuth('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};

// Import other API modules
import blogsAPI from './blogsAPI';
import papersAPI from './papersAPI';

// Export all API functions
export {
  authAPI,
  blogsAPI,
  papersAPI,
  fetchWithAuth, // Export the base function for custom calls
  checkAuthCookie // Export auth cookie check function
};