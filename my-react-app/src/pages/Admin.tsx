import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export default function Admin() {
  const { user, isOwner, loading } = useAuthContext();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-academic-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-academic-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to unauthorized if not owner
  if (!isOwner) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Redirect to dashboard if authenticated and is owner
  return <Navigate to="/admin/dashboard" replace />;
}