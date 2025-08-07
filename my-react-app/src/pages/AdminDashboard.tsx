import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  UserCircleIcon, 
  ChartBarIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useAuthContext } from '../context/AuthContext';
import blogsAPI from '../services/blogsAPI';
import papersAPI from '../services/papersAPI';

interface DashboardStats {
  blogs: {
    total: number;
    published: number;
    draft: number;
  };
  papers: {
    total: number;
  };
}

export default function AdminDashboard() {
  const { user, isOwner, isAdmin } = useAuthContext();
  const [stats, setStats] = useState<DashboardStats>({
    blogs: { total: 0, published: 0, draft: 0 },
    papers: { total: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        
        // Load blog stats
        const blogsResponse = await blogsAPI.getAllBlogs();
        const blogs = Array.isArray(blogsResponse) ? blogsResponse : [];
        const publishedBlogs = blogs.filter(blog => blog.published);
        const draftBlogs = blogs.filter(blog => !blog.published);
        
        // Load paper stats
        const papersResponse = await papersAPI.getAllPapers();
        const papers = Array.isArray(papersResponse) ? papersResponse : [];
        
        setStats({
          blogs: {
            total: blogs.length,
            published: publishedBlogs.length,
            draft: draftBlogs.length
          },
          papers: {
            total: papers.length
          }
        });
        
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
        // Use cached data if available
        const cachedBlogs = localStorage.getItem('adminCachedBlogs');
        const cachedPapers = localStorage.getItem('adminCachedPapers');
        
        if (cachedBlogs) {
          try {
            const blogs = JSON.parse(cachedBlogs);
            const publishedBlogs = blogs.filter((blog: any) => blog.published);
            const draftBlogs = blogs.filter((blog: any) => !blog.published);
            
            setStats({
              blogs: {
                total: blogs.length,
                published: publishedBlogs.length,
                draft: draftBlogs.length
              },
              papers: {
                total: cachedPapers ? JSON.parse(cachedPapers).length : 0
              }
            });
          } catch (parseError) {
            console.error('Error parsing cached data:', parseError);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const dashboardItems = [
    { 
      title: 'Blog Posts', 
      description: 'Manage and publish academic articles',
      icon: <DocumentTextIcon className="h-8 w-8 text-primary-600" />,
      count: stats.blogs.total.toString(),
      link: '/admin/manage-blogs',
      stats: [
        { label: 'Published', value: stats.blogs.published, color: 'text-green-600' },
        { label: 'Draft', value: stats.blogs.draft, color: 'text-yellow-600' }
      ]
    },
    { 
      title: 'Research Papers', 
      description: 'Upload and organize research papers',
      icon: <AcademicCapIcon className="h-8 w-8 text-primary-600" />,
      count: stats.papers.total.toString(),
      link: '/admin/manage-papers',
      stats: []
    },
    { 
      title: 'Analytics', 
      description: 'View website traffic and user engagement metrics',
      icon: <ChartBarIcon className="h-8 w-8 text-primary-600" />,
      count: 'Coming Soon',
      link: '/admin/analytics',
      stats: []
    },
    { 
      title: 'Settings', 
      description: 'Configure website settings and preferences',
      icon: <Cog6ToothIcon className="h-8 w-8 text-primary-600" />,
      count: '',
      link: '/admin/settings',
      stats: []
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-academic-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
              <UserCircleIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-semibold text-academic-900">
                <span className="bg-gradient-to-r from-primary-700 to-academic-800 text-transparent bg-clip-text">
                  Dashboard
                </span>
              </h1>
              <p className="text-academic-600">Welcome, {user?.email}</p>
              {isOwner && (
                <div className="flex items-center mt-1">
                  <ShieldCheckIcon className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-700 font-medium">Website Owner</span>
                </div>
              )}
              {isAdmin && !isOwner && (
                <div className="flex items-center mt-1">
                  <ShieldCheckIcon className="h-4 w-4 text-blue-600 mr-1" />
                  <span className="text-sm text-blue-700 font-medium">Admin User</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Security Status */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <ShieldCheckIcon className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Secure Access Verified
            </h3>
            <p className="text-sm text-green-700">
              {isOwner 
                ? "You are logged in as the website owner with full administrative privileges."
                : "You are logged in as an admin user with limited administrative privileges."}
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dashboardItems.map((item, index) => (
          <Link key={item.title} to={item.link}>
            <motion.div
              className="bg-white rounded-xl shadow-academic-sm p-6 hover:shadow-academic-md transition-all duration-300 cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors duration-300">
                  {item.icon}
                </div>
                <div className="flex items-center gap-2">
                  {item.count && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                      {item.count}
                    </span>
                  )}
                  <ArrowRightIcon className="h-4 w-4 text-academic-400 group-hover:text-primary-600 transition-colors duration-300" />
                </div>
              </div>
              <h2 className="mt-4 text-xl font-serif font-semibold text-academic-900 group-hover:text-primary-700 transition-colors duration-300">
                {item.title}
              </h2>
              <p className="mt-2 text-academic-600">{item.description}</p>
              
              {/* Additional stats for blogs */}
              {item.title === 'Blog Posts' && item.stats && item.stats.length > 0 && (
                <div className="mt-4 flex gap-4">
                  {item.stats.map((stat, statIndex) => (
                    <div key={statIndex} className="flex items-center gap-1">
                      <span className={`text-sm font-medium ${stat.color}`}>
                        {stat.value}
                      </span>
                      <span className="text-xs text-academic-500">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-academic-sm p-6">
        <h2 className="text-xl font-serif font-semibold text-academic-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/add-blog">
            <motion.button
              className="w-full p-4 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors duration-300 text-left"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <DocumentTextIcon className="h-6 w-6 text-primary-600 mb-2" />
              <h3 className="font-medium text-academic-900">Create New Blog Post</h3>
              <p className="text-sm text-academic-600">Write and publish a new article</p>
            </motion.button>
          </Link>
          
          <Link to="/admin/upload-papers">
            <motion.button
              className="w-full p-4 bg-academic-50 border border-academic-200 rounded-lg hover:bg-academic-100 transition-colors duration-300 text-left"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <AcademicCapIcon className="h-6 w-6 text-academic-600 mb-2" />
              <h3 className="font-medium text-academic-900">Upload Research Paper</h3>
              <p className="text-sm text-academic-600">Add a new research paper to the collection</p>
            </motion.button>
          </Link>
          
          <Link to="/admin/profile">
            <motion.button
              className="w-full p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors duration-300 text-left"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <UserCircleIcon className="h-6 w-6 text-green-600 mb-2" />
              <h3 className="font-medium text-academic-900">Update Profile</h3>
              <p className="text-sm text-academic-600">Manage your account settings</p>
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-academic-sm p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-academic-600">Loading dashboard data...</span>
          </div>
        </div>
      )}
    </div>
  );
}