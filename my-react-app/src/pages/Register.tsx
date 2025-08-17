import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

export default function Register() {
  const navigate = useNavigate();
  const { user, isOwner } = useSupabaseAuth();
  
  // If user is already logged in and is owner, redirect to admin
  if (user && isOwner) {
    return <Navigate to="/admin" replace />;
  }

  // If user is logged in but not owner, redirect to unauthorized
  if (user && !isOwner) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-academic-50">
      <motion.div 
        className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-academic-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-academic-900">
            Registration Disabled
          </h2>
          <p className="mt-2 text-center text-sm text-academic-600">
            Registration is currently disabled. Please contact the administrator.
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-primary-600 hover:text-primary-500"
          >
            Back to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
} 