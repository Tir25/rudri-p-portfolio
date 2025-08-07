import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
} from '@heroicons/react/24/outline';
import { useAuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isOwner, logout } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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
  ];

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      // Use the proper logout function from AuthContext
      await logout();
      toast.success('Signed out successfully');
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      toast.error('An error occurred while signing out');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="h-screen flex overflow-hidden bg-academic-50">
      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="w-64 flex flex-col">
          {/* Sidebar component */}
          <div className="flex flex-col flex-grow bg-white border-r border-academic-200 shadow-sm">
            {/* Sidebar header */}
            <div className="h-10 flex items-center px-4 bg-primary-600 text-white">
              <ShieldCheckIcon className="h-5 w-5 mr-1.5" />
              <h1 className="text-base font-serif font-medium">Admin Panel</h1>
            </div>
            
            {/* User info */}
            <div className="flex items-center px-4 py-2 border-b border-academic-200">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <UserCircleIcon className="h-5 w-5 text-primary-600" />
              </div>
              <div className="ml-2 overflow-hidden">
                <p className="text-sm font-medium text-academic-900 truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-academic-500 truncate">
                  {isOwner ? 'Website Owner' : 'Admin User'}
                </p>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex-grow flex flex-col overflow-y-auto">
              <nav className="flex-1 py-2 px-2 space-y-0.5">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive
                        ? 'bg-primary-50 text-primary-600 border border-primary-200'
                        : 'text-academic-700 hover:bg-academic-100 hover:text-academic-900'
                      }`}
                    >
                      <Icon 
                        className={`mr-2 h-4 w-4 flex-shrink-0 ${isActive
                          ? 'text-primary-600'
                          : 'text-academic-500 group-hover:text-academic-700'
                        }`} 
                      />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  );
                })}
                
                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-academic-700 hover:bg-academic-100 hover:text-academic-900"
                >
                  <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4 flex-shrink-0 text-academic-500 group-hover:text-academic-700" />
                  <span className="truncate">{isLoading ? 'Signing out...' : 'Logout'}</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile sidebar */}
      <div 
        className={`lg:hidden fixed inset-0 z-40 flex ${sidebarOpen ? 'visible' : 'invisible'}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Overlay */}
        <div 
          className={`fixed inset-0 bg-academic-900 bg-opacity-50 transition-opacity ease-in-out duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} 
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        ></div>
        
        {/* Sidebar */}
        <div className={`relative max-w-xs w-full bg-white shadow-xl flex flex-col transform transition ease-in-out duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Close button */}
          <div className="absolute top-0 right-0 p-1 m-1">
            <button
              className="h-8 w-8 flex items-center justify-center rounded-full text-academic-500 hover:bg-academic-100"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          
          {/* Sidebar header */}
          <div className="h-10 flex items-center px-4 bg-primary-600 text-white">
            <ShieldCheckIcon className="h-5 w-5 mr-1.5" />
            <h1 className="text-base font-serif font-medium">Admin Panel</h1>
          </div>
          
          {/* User info */}
          <div className="flex items-center px-4 py-2 border-b border-academic-200">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <UserCircleIcon className="h-5 w-5 text-primary-600" />
            </div>
            <div className="ml-2 overflow-hidden">
              <p className="text-sm font-medium text-academic-900 truncate">
                {user?.email}
              </p>
              <p className="text-xs text-academic-500 truncate">
                {isOwner ? 'Website Owner' : 'Admin User'}
              </p>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive
                    ? 'bg-primary-50 text-primary-600 border border-primary-200'
                    : 'text-academic-700 hover:bg-academic-100 hover:text-academic-900'
                  }`}
                >
                  <Icon 
                    className={`mr-2 h-4 w-4 flex-shrink-0 ${isActive
                      ? 'text-primary-600'
                      : 'text-academic-500 group-hover:text-academic-700'
                    }`} 
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
            
            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-academic-700 hover:bg-academic-100 hover:text-academic-900"
            >
              <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4 flex-shrink-0 text-academic-500 group-hover:text-academic-700" />
              <span className="truncate">{isLoading ? 'Signing out...' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content wrapper */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-10 flex items-center h-10 bg-white border-b border-academic-200 shadow-sm px-4">
          <button
            className="text-academic-700 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="ml-4">
            <span className="text-sm font-serif font-medium text-primary-600">Admin Panel</span>
          </div>
        </div>
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}