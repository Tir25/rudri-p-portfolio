/**
 * Frontend configuration file
 * Loads environment variables with proper defaults
 */

const config = {
  // API Configuration
  api: {
    baseUrl: (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, ''),
    // Auto-detect HTTPS in production
    secure: import.meta.env.PROD || import.meta.env.VITE_API_URL?.startsWith('https'),
  },

  // Application Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Rudri Dave',
    description: import.meta.env.VITE_APP_DESCRIPTION || 'Personal website and research papers',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },

  // Feature Flags
  features: {
    enableBlog: import.meta.env.VITE_ENABLE_BLOG !== 'false',
    enablePapers: import.meta.env.VITE_ENABLE_PAPERS !== 'false',
    enableAdmin: import.meta.env.VITE_ENABLE_ADMIN !== 'false',
  },

  // Analytics (Optional)
  analytics: {
    googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID || '',
  },

  // Social Media (Optional)
  social: {
    twitterHandle: import.meta.env.VITE_TWITTER_HANDLE || '@rudridave',
    githubUrl: import.meta.env.VITE_GITHUB_URL || 'https://github.com/rudridave',
    linkedinUrl: import.meta.env.VITE_LINKEDIN_URL || 'https://linkedin.com/in/rudridave',
  },

  // Contact Information
  contact: {
    email: import.meta.env.VITE_CONTACT_EMAIL || 'rudridave1998@gmail.com',
    phone: import.meta.env.VITE_CONTACT_PHONE || '',
  },

  // Development Configuration
  dev: {
    mode: import.meta.env.VITE_DEV_MODE === 'true',
    debug: import.meta.env.VITE_DEBUG_MODE === 'true',
  },

  // Production Configuration
  production: {
    isProduction: import.meta.env.PROD || false,
    enableHttps: import.meta.env.PROD || import.meta.env.VITE_API_URL?.startsWith('https'),
    domain: import.meta.env.VITE_PRODUCTION_DOMAIN || '',
  },
};

export default config;
