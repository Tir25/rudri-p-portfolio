import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  PencilSquareIcon, 
  TrashIcon,
  PlusIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import blogsAPI from '../services/blogsAPI';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  tags: string[];
  content: string;
}

export default function AdminManageBlogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching blogs from API...');
        
        // Try to fetch from API
        const response = await blogsAPI.getAllBlogs();
        console.log('✅ API response:', response);
        
        if (response && Array.isArray(response)) {
          setBlogs(response);
          console.log(`📊 Loaded ${response.length} blogs`);
          
          // Store in localStorage for offline access
          localStorage.setItem('adminCachedBlogs', JSON.stringify(response));
          localStorage.setItem('adminBlogsLastUpdated', new Date().toISOString());
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.warn('⚠️ Failed to load blogs from API, using cached data:', error);
        
        // Try to load from localStorage as fallback
        const cachedBlogs = localStorage.getItem('adminCachedBlogs');
        if (cachedBlogs) {
          try {
            const parsedBlogs = JSON.parse(cachedBlogs);
            setBlogs(parsedBlogs);
            toast.warning('Showing cached blogs (offline mode)');
            console.log(`📱 Loaded ${parsedBlogs.length} cached blogs`);
          } catch (parseError) {
            console.error('❌ Failed to parse cached blogs:', parseError);
            setBlogs([]);
            toast.error('Failed to load blogs');
          }
        } else {
          setBlogs([]);
          toast.error('No blogs available');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDeleteBlog = async (id: number) => {
    try {
      console.log('🗑️ Deleting blog with ID:', id);
      
      // Delete from API
      await blogsAPI.deleteBlog(id.toString());
      
      // Remove from local state
      setBlogs(blogs.filter(blog => blog.id !== id));
      toast.success('Blog post deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting blog:', error);
      toast.error('Failed to delete blog post');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-academic-600">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <DocumentTextIcon className="h-8 w-8 text-primary-600 mr-3" />
            <h1 className="text-2xl font-serif font-semibold text-academic-900">
              Manage Blog Posts
            </h1>
          </div>
          <Link
            to="/admin/add-blog"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Post
          </Link>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-12 w-12 text-academic-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-academic-900 mb-2">No blog posts found</h3>
            <p className="text-academic-600 mb-6">Get started by creating your first blog post.</p>
            <Link
              to="/admin/add-blog"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create First Post
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden shadow ring-1 ring-academic-200 md:rounded-lg">
            <table className="min-w-full divide-y divide-academic-200">
              <thead className="bg-academic-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-academic-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-academic-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-academic-500 uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-academic-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-academic-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-academic-200">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-academic-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-academic-900">{blog.title}</div>
                      <div className="text-sm text-academic-500">{blog.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        blog.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {blog.tags && blog.tags.length > 0 ? (
                          blog.tags.map((tag, index) => (
                            <span key={index} className="inline-flex px-2 py-1 text-xs bg-academic-100 text-academic-800 rounded-full">
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-academic-500">No tags</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 text-academic-400 mr-2" />
                        <span className="text-sm text-academic-900">
                          {new Date(blog.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/admin/edit-blog/${blog.id}`}
                          className="text-primary-600 hover:text-primary-900 p-1 rounded"
                        >
                          <PencilSquareIcon className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteBlog(blog.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}