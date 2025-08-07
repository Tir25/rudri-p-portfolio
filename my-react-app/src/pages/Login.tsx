import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { AcademicCapIcon, LockClosedIcon, EnvelopeIcon, ShieldCheckIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuthContext } from '../context/AuthContext';
import { logSecurityEvent, loginRateLimiter, sanitizeInput } from '../utils/security';
import { getOwnerEmail } from '../utils/ownerCheck';
import AuthStatusTest from '../components/AuthStatusTest';
// API services are now handled through AuthContext which uses api.ts service

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { user, isOwner, login } = useAuthContext();
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // If user is already logged in and is owner, redirect to admin
  if (user && isOwner) {
    return <Navigate to="/admin" replace />;
  }

  // If user is logged in but not owner, redirect to unauthorized
  if (user && !isOwner) {
    return <Navigate to="/unauthorized" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);
    
    if (!sanitizedEmail || !sanitizedPassword) {
      toast.error('Please enter both email and password');
      return;
    }

    // Check rate limiting
    if (!loginRateLimiter.isAllowed(sanitizedEmail)) {
      toast.error('Too many login attempts. Please try again later.');
      logSecurityEvent('rate_limit_exceeded', { email: sanitizedEmail });
      return;
    }
    
    setIsLoading(true);
    
    try {
      logSecurityEvent('login_attempt', { email: sanitizedEmail });
      
      console.log('Login attempt with:', { email: sanitizedEmail });
      
      // Use authentication through AuthContext which now connects to the backend API
      // The login function will try the API first, then fall back to client-side auth if API fails
      const result = await login(sanitizedEmail, sanitizedPassword);
      
      console.log('Login result:', result);
      
      if (result && result.success) {
        logSecurityEvent('login_successful', { email: sanitizedEmail });
        loginRateLimiter.reset(sanitizedEmail);
        toast.success('Login successful');
        
        // Navigate to admin dashboard
        navigate('/admin/dashboard');
      } else {
        const errorMessage = result?.error || 'Login failed. Please check your credentials.';
        logSecurityEvent('login_failed', { email: sanitizedEmail, error: errorMessage });
        toast.error(errorMessage);
        console.error('Login failed:', errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logSecurityEvent('login_error', { email: sanitizedEmail, error: errorMessage });
      toast.error('An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
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
        <div>
          <div className="mx-auto h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
            <AcademicCapIcon className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-serif font-bold text-academic-900">
            <span className="bg-gradient-to-r from-primary-700 to-academic-800 text-transparent bg-clip-text">
              Admin Portal
            </span>
          </h2>
          <p className="mt-2 text-center text-sm text-academic-600">
            Sign in to access the administrative dashboard
          </p>
        </div>

        {/* Owner Access Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ShieldCheckIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Owner Access Only
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  This admin panel is restricted to the website owner only. 
                  If you're not the owner, you won't be able to access the dashboard.
                </p>
                <p className="mt-2 font-medium">
                  Owner Email: {getOwnerEmail()}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-academic-400" aria-hidden="true" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-t-lg relative block w-full px-12 py-3 border border-academic-300 placeholder-academic-500 text-academic-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-academic-400" aria-hidden="true" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-b-lg relative block w-full px-12 py-3 border border-academic-300 placeholder-academic-500 text-academic-900 focus:outline-none focus:ring-primary-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              <div 
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" 
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-academic-400 hover:text-academic-600" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-academic-400 hover:text-academic-600" />
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-academic-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-academic-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LockClosedIcon
                  className="h-5 w-5 text-primary-300 group-hover:text-primary-200 transition-colors duration-200"
                  aria-hidden="true"
                />
              </span>
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-academic-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-academic-500">Academic Portal</span>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm text-academic-500">
            <p>© {new Date().getFullYear()} Rudri Dave. All rights reserved.</p>
          </div>
          
          {/* Auth Status Test Component */}
          <AuthStatusTest />
          
          {/* Debug Info */}
          <div className="mt-4 p-4 bg-gray-100 rounded text-xs">
            <h3 className="font-bold mb-2">Debug Info:</h3>
            <div>User: {user ? user.email : 'None'}</div>
            <div>Is Owner: {isOwner ? 'Yes' : 'No'}</div>
            <div>LocalStorage: {localStorage.getItem('user') ? 'Has data' : 'Empty'}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}