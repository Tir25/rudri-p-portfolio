import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

/**
 * This component serves as a redirect from old /admin path to the new admin dashboard
 */
export default function AdminPage() {
  const { user } = useAuthContext();
  
  // If user is logged in, redirect to admin dashboard
  if (user) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  // If not logged in, redirect to login page
  return <Navigate to="/login" replace />;
}