import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading, isOwner, isAdmin } = useAuthContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-academic-50">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is the owner or admin
  if (!isOwner && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}