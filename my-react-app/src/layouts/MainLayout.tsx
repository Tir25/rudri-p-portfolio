import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useAuthContext } from '../context/AuthContext';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'My Papers', href: '/papers' },
  { name: 'Admin Panel', href: '/admin/dashboard' },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuthContext();

  return (
    <div className="min-h-screen bg-academic-50">
      {/* Navigation */}
      <nav className="bg-white shadow-academic border-b border-academic-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 group">
                <h1 className="text-3xl font-serif font-bold text-academic-900 transition-all duration-500 group-hover:text-primary-600 group-hover:scale-110 group-hover:rotate-1 transform">
                  <span className="inline-block transform group-hover:skew-x-12 transition-transform duration-300">
                    <span className="text-primary-700 group-hover:text-primary-800">R</span>
                    <span className="text-academic-800 group-hover:text-academic-900">D</span>
                  </span>
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </h1>
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => (
                // Only show Admin Panel link if user is logged in
                (item.name !== 'Admin Panel' || user) && (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      location.pathname === item.href
                        ? 'text-primary-600 bg-primary-50 border border-primary-200 shadow-sm'
                        : 'text-academic-700 hover:text-primary-600 hover:bg-academic-100'
                    }`}
                  >
                    {item.name}
                    {location.pathname === item.href && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 transform scale-x-100 transition-transform duration-300"></span>
                    )}
                  </Link>
                )
              ))}
              
              {/* Admin Access button */}
              <Link
                to={user ? '/admin/dashboard' : '/login'}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-all duration-300 transform hover:scale-105"
              >
                <ShieldCheckIcon className="h-5 w-5" />
                {user ? 'Admin Panel' : 'Admin Login'}
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                type="button"
                className="text-academic-700 hover:text-academic-900 p-2 rounded-lg hover:bg-academic-100 transition-all duration-200 transform hover:scale-110"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                <span className="sr-only">Open main menu</span>
                <div className="relative w-6 h-6">
                  <span className={`absolute top-0 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${
                    mobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''
                  }`}></span>
                  <span className={`absolute top-2 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${
                    mobileMenuOpen ? 'opacity-0' : ''
                  }`}></span>
                  <span className={`absolute top-4 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${
                    mobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''
                  }`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-4 pt-4 pb-6 space-y-2 bg-white border-t border-academic-200 shadow-lg">
            {navigation.map((item) => (
              // Only show Admin Panel link if user is logged in
              (item.name !== 'Admin Panel' || user) && (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 transform ${
                    location.pathname === item.href
                      ? 'text-primary-600 bg-primary-50 border border-primary-200 scale-105'
                      : 'text-academic-700 hover:text-primary-600 hover:bg-academic-100 hover:scale-105'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )
            ))}
            
            {/* Admin Access button */}
            <Link
              to={user ? '/admin' : '/login'}
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium bg-primary-600 text-white hover:bg-primary-700 transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShieldCheckIcon className="h-5 w-5" />
              {user ? 'Admin Panel' : 'Admin Login'}
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-academic-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-academic-500 text-sm">
              © 2024 RD. All rights reserved.
            </div>
            
            {/* Social Media Links */}
            <div className="flex items-center space-x-6">
              {/* LinkedIn */}
              <a
                href="https://linkedin.com/in/rudri-dave-09091a183"
                target="_blank"
                rel="noopener noreferrer"
                className="text-academic-600 hover:text-primary-600 transition-all duration-300 transform hover:scale-110 hover:rotate-3"
                aria-label="LinkedIn Profile"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              
              {/* Instagram */}
              <a
                href="https://www.instagram.com/rudri__dave?utm_source=ig_web_button_share_sheet&igsh=NjFxcDJ2bGlsYTM4"
                target="_blank"
                rel="noopener noreferrer"
                className="text-academic-600 hover:text-primary-600 transition-all duration-300 transform hover:scale-110 hover:-rotate-3"
                aria-label="Instagram Profile"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}