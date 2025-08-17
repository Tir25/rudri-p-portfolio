import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user } = useSupabaseAuth();

  return (
    <div className="min-h-screen bg-academic-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-academic-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-academic-900">Rudri Dave</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/blog" className="text-academic-600 hover:text-academic-900">Blog</Link>
              <Link to="/papers" className="text-academic-600 hover:text-academic-900">Papers</Link>
              {user ? (
                <Link to="/admin" className="text-primary-600 hover:text-primary-700">Admin</Link>
              ) : (
                <Link to="/login" className="text-primary-600 hover:text-primary-700">Login</Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-academic-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-academic-500">
            <p>&copy; {new Date().getFullYear()} Rudri Dave. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}