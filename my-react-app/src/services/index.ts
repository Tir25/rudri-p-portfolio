/**
 * Services index file
 * Export all API services from a single entry point
 */

import { authAPI, fetchWithAuth, checkAuthCookie } from './api';
import blogsAPI from './blogsAPI';
import papersAPI from './papersAPI';

export {
  authAPI,
  blogsAPI,
  papersAPI,
  fetchWithAuth,
  checkAuthCookie
};