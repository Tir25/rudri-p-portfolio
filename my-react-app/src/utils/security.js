// Security utility functions for admin panel
// Note: These functions now work with the API services for backend authentication

/**
 * Log security events for monitoring
 * @param {string} event - The security event type
 * @param {Object} details - Additional details about the event
 */
export const logSecurityEvent = (event, details = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    details,
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  // Log to console in development
  if (import.meta.env.DEV) {
    console.log('🔒 Security Event:', logEntry);
  }

  // In production, you might want to send this to a logging service
  // Example: sendToLoggingService(logEntry);
};

/**
 * Check if the current session is secure
 * @returns {boolean} - Whether the session is considered secure
 */
export const isSecureSession = () => {
  // Check if we're on HTTPS (except for localhost)
  const isHttps = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
  
  // Check if we're not in an iframe (clickjacking protection)
  const isNotInIframe = window.self === window.top;
  
  return isHttps && isNotInIframe;
};

/**
 * Validate email format for owner access
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether the email format is valid
 */
export const isValidOwnerEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitize user input for security
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .trim();
};

/**
 * Rate limiting utility for login attempts
 */
class RateLimiter {
  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) { // 5 attempts per 15 minutes
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.attempts = new Map();
  }

  isAllowed(identifier) {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = userAttempts.filter(timestamp => now - timestamp < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);
    
    return true;
  }

  reset(identifier) {
    this.attempts.delete(identifier);
  }
}

export const loginRateLimiter = new RateLimiter(); 