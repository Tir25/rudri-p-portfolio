import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  XMarkIcon,
  Bars3Icon, 
  UserCircleIcon, 
  PencilSquareIcon,
  DocumentTextIcon,
  ArrowUpTrayIcon,
  DocumentDuplicateIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline'
import { useSupabaseAuth } from '../hooks/useSupabaseAuth'
import { toast } from 'react-hot-toast'

interface SupabaseAdminLayoutProps {
  children: React.ReactNode
}

export default function SupabaseAdminLayout({ children }: SupabaseAdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, isOwner, signOut } = useSupabaseAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/admin/dashboard',
      icon: ShieldCheckIcon 
    },
    { 
      name: 'Profile', 
      href: '/admin/profile', 
      icon: UserCircleIcon 
    },
    { 
      name: 'Add Blog', 
      href: '/admin/add-blog', 
      icon: PencilSquareIcon 
    },
    { 
      name: 'Manage Blogs', 
      href: '/admin/manage-blogs', 
      icon: DocumentTextIcon 
    },
    { 
      name: 'Upload Papers', 
      href: '/admin/upload-papers', 
      icon: ArrowUpTrayIcon 
    },
    { 
      name: 'Manage Papers', 
      href: '/admin/manage-papers', 
      icon: DocumentDuplicateIcon 
    },
    { 
      name: 'Sync Papers', 
      href: '/admin/sync-papers', 
      icon: ArrowPathIcon 
    },
    { 
      name: 'Diagnostic Tool', 
      href: '/admin/diagnostic', 
      icon: WrenchScrewdriverIcon 
    },
  ]

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut()
      toast.success('Signed out successfully')
      navigate('/login')
    } catch (error) {
      toast.error('An error occurred while signing out')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className="h-screen flex overflow-hidden bg-academic-50">
      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="w-64 flex flex-col">
          {/* Sidebar component */}
          <div className="flex flex-col flex-grow bg-white border-r border-academic-200 shadow-sm">
            {/* Logo */}
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary-600">
              <div className="flex items-center">
                <ShieldCheckIcon className="h-8 w-8 text-white" />
                <span className="ml-2 text-xl font-semibold text-white">Admin Panel</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isActive
                        ? 'bg-primary-100 text-primary-900 border-r-2 border-primary-600'
                        : 'text-academic-600 hover:bg-academic-50 hover:text-academic-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        isActive ? 'text-primary-600' : 'text-academic-400 group-hover:text-academic-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* User section */}
            <div className="flex-shrink-0 flex border-t border-academic-200 p-4">
              <div className="flex items-center w-full">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <UserCircleIcon className="h-5 w-5 text-primary-600" />
                  </div>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-academic-900 truncate">
                    {user?.email || 'Admin User'}
                  </p>
                  <p className="text-xs text-academic-500 truncate">
                    {isOwner ? 'Owner' : 'Administrator'}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="ml-2 flex-shrink-0 p-1 rounded-md text-academic-400 hover:text-academic-500 hover:bg-academic-100 transition-colors duration-200 disabled:opacity-50"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 flex z-40">
          <div className="fixed inset-0 bg-academic-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Mobile navigation */}
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <ShieldCheckIcon className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-xl font-semibold text-academic-900">Admin Panel</span>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                        isActive
                          ? 'bg-primary-100 text-primary-900'
                          : 'text-academic-600 hover:bg-academic-50 hover:text-academic-900'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon
                        className={`mr-4 h-6 w-6 ${
                          isActive ? 'text-primary-600' : 'text-academic-400 group-hover:text-academic-500'
                        }`}
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Mobile user section */}
            <div className="flex-shrink-0 flex border-t border-academic-200 p-4">
              <div className="flex items-center w-full">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <UserCircleIcon className="h-5 w-5 text-primary-600" />
                  </div>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-academic-900 truncate">
                    {user?.email || 'Admin User'}
                  </p>
                  <p className="text-xs text-academic-500 truncate">
                    {isOwner ? 'Owner' : 'Administrator'}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="ml-2 flex-shrink-0 p-1 rounded-md text-academic-400 hover:text-academic-500 hover:bg-academic-100 transition-colors duration-200 disabled:opacity-50"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top bar */}
        <div className="lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-academic-500 hover:text-academic-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* Page content */}
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
