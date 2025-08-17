// Utility to check and debug owner email configuration

/**
 * Checks if the provided email matches the configured owner email
 * @param {string} email - The email to check
 * @returns {boolean} - Whether the email matches the owner email
 */
export const checkOwnerEmail = (email) => {
  // Get the owner email from environment variables or fallback
  const ownerEmail = import.meta.env.VITE_OWNER_EMAIL || 'admin@rudridave.com';
  
  // Check if they match (removed debug logs for security)
  const isMatch = email === ownerEmail;
  
  return isMatch;
};

/**
 * Gets the current owner email configuration
 * @returns {string} - The configured owner email
 */
export const getOwnerEmail = () => {
  return import.meta.env.VITE_OWNER_EMAIL || 'admin@rudridave.com';
};