// Utility to check and debug owner email configuration

/**
 * Checks if the provided email matches the configured owner email
 * @param {string} email - The email to check
 * @returns {boolean} - Whether the email matches the owner email
 */
export const checkOwnerEmail = (email) => {
  // Get the owner email from environment variables or fallback
  const ownerEmail = import.meta.env.VITE_OWNER_EMAIL || 'admin@rudridave.com';
  
  // Log for debugging
  console.log('Checking owner email:');
  console.log('- Current user email:', email);
  console.log('- Configured owner email:', ownerEmail);
  
  // Check if they match
  const isMatch = email === ownerEmail;
  console.log('- Is match:', isMatch);
  
  return isMatch;
};

/**
 * Gets the current owner email configuration
 * @returns {string} - The configured owner email
 */
export const getOwnerEmail = () => {
  return import.meta.env.VITE_OWNER_EMAIL || 'admin@rudridave.com';
};