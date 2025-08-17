import { Navigate } from 'react-router-dom'
import { useSupabaseAuth } from '../hooks/useSupabaseAuth'

interface SupabaseProtectedRouteProps {
  children: React.ReactNode
  requireOwner?: boolean
}

export default function SupabaseProtectedRoute({ 
  children, 
  requireOwner = false 
}: SupabaseProtectedRouteProps) {
  const { user, loading, isOwner, isAdmin } = useSupabaseAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-academic-50">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // If owner access is required, check if user is owner
  if (requireOwner && !isOwner) {
    return <Navigate to="/unauthorized" replace />
  }

  // If admin access is required, check if user is admin
  if (!requireOwner && !isAdmin) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
