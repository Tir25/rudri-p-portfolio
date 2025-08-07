import { motion } from 'framer-motion';
import { ShieldExclamationIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export default function Unauthorized() {
  const { user } = useAuthContext();

  const handleSignOut = async () => {
    try {
      // Remove user data from localStorage
      localStorage.removeItem('user');
      // Reload the page to update auth context
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-academic-50">
      <motion.div 
        className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-academic-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
            <ShieldExclamationIcon className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-serif font-bold text-academic-900">
            <span className="bg-gradient-to-r from-red-700 to-red-800 text-transparent bg-clip-text">
              Access Denied
            </span>
          </h2>
          <p className="mt-2 text-center text-sm text-academic-600">
            You don't have permission to access the admin panel
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ShieldExclamationIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Unauthorized Access
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  Only the website owner can access the administrative dashboard. 
                  If you believe this is an error, please contact the administrator.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Return to Home
          </Link>

          {user && (
            <button
              onClick={handleSignOut}
              className="w-full flex justify-center items-center px-4 py-2 border border-academic-300 text-sm font-medium rounded-lg text-academic-700 bg-white hover:bg-academic-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              Sign Out
            </button>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-academic-500">
          <p>© {new Date().getFullYear()} Rudri Dave. All rights reserved.</p>
        </div>
      </motion.div>
    </div>
  );
} 