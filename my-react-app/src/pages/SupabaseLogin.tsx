import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { 
  AcademicCapIcon, 
  LockClosedIcon, 
  EnvelopeIcon, 
  ShieldCheckIcon, 
  EyeIcon, 
  EyeSlashIcon 
} from '@heroicons/react/24/outline'
import { useSupabaseAuth } from '../hooks/useSupabaseAuth'

export default function SupabaseLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { user, isOwner, signIn } = useSupabaseAuth()
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // If user is already logged in and is owner, redirect to admin
  if (user && isOwner) {
    return <Navigate to="/admin" replace />
  }

  // If user is logged in but not owner, redirect to unauthorized
  if (user && !isOwner) {
    return <Navigate to="/unauthorized" replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please enter both email and password')
      return
    }
    
    setIsLoading(true)
    
    try {
      console.log('Login attempt with:', { email })
      
      const result = await signIn(email, password)
      
      console.log('Login result:', result)
      
      if (result.success) {
        toast.success('Login successful')
        navigate('/admin/dashboard')
      } else {
        const errorMessage = result.error || 'Login failed. Please check your credentials.'
        toast.error(errorMessage)
        console.error('Login failed:', errorMessage)
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
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
          <div className="mx-auto h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
            <AcademicCapIcon className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-academic-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-academic-600">
            Sign in to access the admin dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-academic-700">
                Email Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-academic-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-academic-300 placeholder-academic-500 text-academic-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-academic-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-academic-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-12 py-3 border border-academic-300 placeholder-academic-500 text-academic-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-academic-400 hover:text-academic-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-academic-400 hover:text-academic-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 mr-2" />
                  Sign In
                </div>
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-academic-500">
              This is a secure admin login for authorized personnel only
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
