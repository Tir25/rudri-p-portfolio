import { createContext, useContext, useEffect, useState } from "react";
import { logSecurityEvent, isSecureSession, isValidOwnerEmail } from "../utils/security";
import { authAPI } from "../services/api";

// Create the context
export const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuthContext = () => {
  return useContext(AuthContext);
};

// Owner email configuration - this should be the website owner's email
const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL || 'rudridave1998@gmail.com';

// Provider component
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Log security check
    logSecurityEvent('session_security_check', {
      isSecure: isSecureSession(),
      ownerEmail: OWNER_EMAIL
    });

    // Check authentication status from backend
    const checkAuthStatus = async () => {
      try {
        // Try to get profile from the API
        const userData = await authAPI.getProfile();
        setUser(userData);
        
        // Check if the current user is the owner
        const isOwnerUser = userData.email === OWNER_EMAIL && isValidOwnerEmail(userData.email);
        setIsOwner(isOwnerUser);
        
        // Check admin status
        setIsAdmin(userData.role === 'admin' || userData.is_owner || isOwnerUser);
        
        // Log authentication event
        logSecurityEvent('user_authenticated', {
          email: userData.email,
          isOwner: isOwnerUser,
          isAdmin: userData.role === 'admin' || userData.is_owner || isOwnerUser,
          uid: userData.id || userData.email
        });
      } catch (apiError) {
        // API call failed, user is not authenticated
        console.log('Backend auth check failed, user not authenticated');
        setUser(null);
        setIsOwner(false);
        setIsAdmin(false);
        logSecurityEvent('user_signed_out');
      }
      
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Attempting API login with:', { email });
      const response = await authAPI.login(email, password);
      console.log('API login response:', response);
      
      // Extract user data from response - the API returns {message, user, token}
      const userData = response.user || response;
      
      // Store token if provided
      if (response.token) {
        userData.token = response.token;
      }
      
      // Store user data in localStorage as a fallback
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      
      // Check if the current user is the owner
      const isOwnerUser = userData.email === OWNER_EMAIL && isValidOwnerEmail(userData.email);
      setIsOwner(isOwnerUser);
      setIsAdmin(userData.role === 'admin' || userData.is_owner || isOwnerUser);
      
      logSecurityEvent('user_authenticated', {
        email: userData.email,
        isOwner: isOwnerUser,
        isAdmin: userData.role === 'admin' || userData.is_owner || isOwnerUser,
        uid: userData.id || userData.email
      });
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      logSecurityEvent('login_error', { 
        email, 
        error: error.message || 'Unknown error'
      });
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      // Try to logout through the API
      await authAPI.logout();
      
      // Clear local state
      localStorage.removeItem('user');
      setUser(null);
      setIsOwner(false);
      setIsAdmin(false);
      logSecurityEvent('user_signed_out');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API logout fails, clear local state
      localStorage.removeItem('user');
      setUser(null);
      setIsOwner(false);
      setIsAdmin(false);
      logSecurityEvent('user_signed_out');
    }
  };

  const value = {
    user,
    loading,
    isOwner,
    isAdmin,
    OWNER_EMAIL,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};