import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { getAllBlogs, deleteBlog, type Blog } from '../services/supabaseBlogService';

export default function AdminManageBlogs() {
  const { user } = useSupabaseAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const blogsData = await getAllBlogs();
      setBlogs(blogsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (blogId: string, blogTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${blogTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingBlogId(blogId);
      await deleteBlog(blogId);
      setBlogs(prev => prev.filter(blog => blog.id !== blogId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete blog');
    } finally {
      setDeletingBlogId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-academic-900">Manage Blogs</h1>
          <p className="text-academic-600">View and manage all blog posts</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-academic-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-academic-100 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-academic-900">Manage Blogs</h1>
          <p className="text-academic-600">View and manage all blog posts</p>
        </div>
        <Link
          to="/admin/add-blog"
          className="px-4 py-2 bg-academic-600 text-white rounded-md hover:bg-academic-700 focus:outline-none focus:ring-2 focus:ring-academic-500"
        >
          Add New Blog
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {blogs.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-academic-600 mb-4">No blogs found.</p>
            <Link
              to="/admin/add-blog"
              className="px-4 py-2 bg-academic-600 text-white rounded-md hover:bg-academic-700 focus:outline-none focus:ring-2 focus:ring-academic-500"
            >
              Create Your First Blog
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-academic-200">
              <thead className="bg-academic-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-academic-500 uppercase tracking-wider">
                    Blog
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-academic-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-academic-200">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-academic-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {blog.cover_image_url && (
                          <img
                            src={blog.cover_image_url}
                            alt={blog.title}
                            className="h-12 w-12 rounded-lg object-cover mr-4"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-academic-900">
                            {blog.title}
                          </div>
                          <div className="text-sm text-academic-500">
                            {truncateText(blog.content, 100)}
                          </div>
                          <div className="text-xs text-academic-400">
                            Slug: {blog.slug}
                          </div>
                        </div>
                      </div>
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
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {blog.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 text-xs font-medium bg-academic-100 text-academic-800 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-academic-500">
                      {formatDate(blog.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/admin/edit-blog/${blog.id}`}
                          className="text-academic-600 hover:text-academic-900"
                        >
                          Edit
                        </Link>
                        <Link
                          to={`/blog/${blog.slug}`}
                          target="_blank"
                          className="text-academic-600 hover:text-academic-900"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDeleteBlog(blog.id, blog.title)}
                          disabled={deletingBlogId === blog.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingBlogId === blog.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-academic-50 border border-academic-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-academic-900 mb-2">Current User</h3>
        <p className="text-academic-600">Email: {user?.email}</p>
        <p className="text-academic-600">User ID: {user?.id}</p>
      </div>
    </div>
  );
}