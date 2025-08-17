import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPublishedBlogs, type Blog } from '../services/supabaseBlogService';

export default function Blog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const blogsData = await getPublishedBlogs();
      setBlogs(blogsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  const handleReadMore = (slug: string) => {
    console.log('🔍 handleReadMore called with slug:', slug);
    try {
      navigate(`/blog/${slug}`);
      console.log('✅ Navigation successful to:', `/blog/${slug}`);
    } catch (error) {
      console.error('❌ Navigation error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-academic-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-academic-900 mb-4">Blog</h1>
            <p className="text-xl text-academic-600 mb-8">Loading blog posts...</p>
            <div className="animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="h-48 bg-academic-200"></div>
                    <div className="p-6">
                      <div className="h-4 bg-academic-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-academic-200 rounded w-1/2 mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-academic-200 rounded"></div>
                        <div className="h-3 bg-academic-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-academic-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-academic-900 mb-4">Blog</h1>
          <p className="text-xl text-academic-600">
            Thoughts, insights, and updates from my academic journey
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-semibold text-academic-900 mb-2">No blog posts yet</h2>
            <p className="text-academic-600">
              Check back soon for new content!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <article key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {blog.cover_image_url && (
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={blog.cover_image_url}
                      alt={blog.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center text-sm text-academic-500 mb-2">
                    <time dateTime={blog.created_at}>
                      {formatDate(blog.created_at)}
                    </time>
                    <span className="mx-2">•</span>
                    <span>{calculateReadTime(blog.content)}</span>
                  </div>
                  
                  <h2 className="text-xl font-semibold text-academic-900 mb-3 line-clamp-2">
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="hover:text-academic-600 transition-colors duration-200"
                    >
                      {blog.title}
                    </Link>
                  </h2>
                  
                  <p className="text-academic-600 mb-4 line-clamp-3">
                    {truncateText(blog.content, 150)}
                  </p>
                  
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs font-medium bg-academic-100 text-academic-800 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {blog.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs font-medium bg-academic-100 text-academic-800 rounded-full">
                          +{blog.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  <button
                    onClick={() => handleReadMore(blog.slug)}
                    className="inline-flex items-center text-academic-600 hover:text-academic-800 font-medium transition-colors duration-200 group"
                  >
                    Read more
                    <svg 
                      className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}