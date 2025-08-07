import { useState } from 'react';
import { authAPI, checkAuthCookie } from '../services';
import { useAuthContext } from '../context/AuthContext';

export default function AuthStatusTest() {
  const [authStatus, setAuthStatus] = useState<{
    cookieAuth: boolean | null;
    apiResponse: unknown | null;
    error: string | null;
  }>({
    cookieAuth: null,
    apiResponse: null,
    error: null,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();
  
  async function checkAuth() {
    setIsLoading(true);
    setAuthStatus({
      cookieAuth: null,
      apiResponse: null,
      error: null,
    });
    
    try {
      // Check if cookie auth is working
      const hasCookieAuth = await checkAuthCookie();
      
      // Try to get profile data
      let apiResponse = null;
      try {
        apiResponse = await authAPI.getProfile();
      } catch (error) {
        console.error('Error getting profile:', error);
      }
      
      setAuthStatus({
        cookieAuth: hasCookieAuth,
        apiResponse,
        error: null,
      });
    } catch (error) {
      setAuthStatus({
        cookieAuth: false,
        apiResponse: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <div className="mt-6 bg-white p-4 shadow rounded-lg">
      <h2 className="text-lg font-medium text-gray-900">Authentication Status Check</h2>
      
      <div className="mt-2 bg-blue-50 border border-blue-200 p-3 rounded">
        <p className="text-blue-800 text-sm">
          This component tests the connection between the frontend and backend authentication.
        </p>
      </div>
      
      <div className="mt-4 flex flex-col space-y-3">
        <div>
          <span className="text-sm font-medium">Local Auth Status:</span>
          <span className="ml-2 text-sm">{user ? '✅ Logged in' : '❌ Not logged in'}</span>
        </div>
        
        <div>
          <span className="text-sm font-medium">Cookie Auth Status:</span>
          <span className="ml-2 text-sm">
            {authStatus.cookieAuth === null ? '🔄 Not checked' : 
             authStatus.cookieAuth ? '✅ Valid' : '❌ Invalid'}
          </span>
        </div>
        
        {authStatus.apiResponse && (
          <div>
            <span className="text-sm font-medium">API Response:</span>
            <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(authStatus.apiResponse, null, 2)}
            </pre>
          </div>
        )}
        
        {authStatus.error && (
          <div className="text-red-600 text-sm">
            Error: {authStatus.error}
          </div>
        )}
      </div>
      
      <button
        onClick={checkAuth}
        disabled={isLoading}
        className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isLoading ? 'Checking...' : 'Check Authentication'}
      </button>
    </div>
  );
}