// Global type declarations for JavaScript modules

declare module '*.jsx' {
  const content: unknown;
  export default content;
}

declare module '*.js' {
  const content: unknown;
  export default content;
}

// Declare modules that don't have type definitions
// Note: Old authentication modules have been removed and replaced with Supabase

// Global types
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

// Blog post type
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
  image?: string;
  readTime: string;
}

// Paper type
export interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  keywords: string[];
  pdfUrl: string;
  storagePath: string;
  uploadDate: string;
  category: string;
}

// Admin user type
export interface AdminUser {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

// Auth context type
export interface AuthContextType {
  user: unknown;
  loading: boolean;
  isOwner: boolean;
  isAdmin: boolean;
  OWNER_EMAIL: string;
}

// Error type
export interface ApiError {
  message: string;
  code?: string;
}

// Auth result
export interface AuthResult {
  user?: unknown;
  error?: string;
}

// Image upload result
export interface ImageUploadResult {
  url: string;
  path: string;
}

// Form data types
export interface BlogFormData {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  coverImage?: File;
}

export interface PaperFormData {
  title: string;
  authors: string[];
  abstract: string;
  keywords: string[];
  category: string;
  pdfFile?: File;
} 