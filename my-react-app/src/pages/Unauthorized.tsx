import { Link } from 'react-router-dom';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

export default function Unauthorized() {
  const { user } = useSupabaseAuth();

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-academic-50">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-academic-400 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-academic-900 mb-4">Access Denied</h2>
        <p className="text-academic-600 mb-8">
          You don't have permission to access this page. Please contact the administrator if you believe this is an error.
        </p>
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go Home
          </Link>
          {user ? (
            <Link
              to="/admin"
              className="block text-primary-600 hover:text-primary-700"
            >
              Back to Admin
            </Link>
          ) : (
            <Link
              to="/login"
              className="block text-primary-600 hover:text-primary-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 