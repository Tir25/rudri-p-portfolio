import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlog, type Blog } from '../services/supabaseBlogService';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBlog = useCallback(async () => {
    try {
      setLoading(true);
      const blogData = await getBlog(slug!);
      if (!blogData) {
        setError('Blog post not found');
        return;
      }
      setBlog(blogData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blog post');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      loadBlog();
    }
  }, [slug, loadBlog]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-academic-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-academic-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-academic-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-academic-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-academic-200 rounded"></div>
              <div className="h-4 bg-academic-200 rounded w-5/6"></div>
              <div className="h-4 bg-academic-200 rounded w-4/6"></div>
              <div className="h-4 bg-academic-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-academic-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">📄</div>
            <h1 className="text-3xl font-bold text-academic-900 mb-4">Blog Post Not Found</h1>
            <p className="text-academic-600 mb-8">
              The blog post you're looking for doesn't exist or may have been removed.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center px-4 py-2 bg-academic-600 text-white rounded-md hover:bg-academic-700 focus:outline-none focus:ring-2 focus:ring-academic-500"
            >
              <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-academic-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}

        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {blog.cover_image_url && (
            <div className="w-full h-64 md:h-96 relative">
              <img
                src={blog.cover_image_url}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            <header className="mb-8">
              <div className="flex items-center text-sm text-academic-500 mb-4">
                <time dateTime={blog.created_at}>
                  {formatDate(blog.created_at)}
                </time>
                <span className="mx-2">•</span>
                <span>{calculateReadTime(blog.content)}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-academic-900 mb-4 leading-tight">
                {blog.title}
              </h1>

              {blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm font-medium bg-academic-100 text-academic-800 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-academic-700 leading-relaxed">
                {blog.content}
              </div>
            </div>

            <footer className="mt-12 pt-8 border-t border-academic-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-academic-500">
                  <p>Last updated: {formatDate(blog.updated_at)}</p>
                </div>
                <Link
                  to="/blog"
                  className="inline-flex items-center text-academic-600 hover:text-academic-800 font-medium transition-colors duration-200"
                >
                  <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Blog
                </Link>
              </div>
            </footer>
          </div>
        </article>

        <div className="mt-8 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center px-6 py-3 bg-academic-600 text-white rounded-md hover:bg-academic-700 focus:outline-none focus:ring-2 focus:ring-academic-500 transition-colors duration-200"
          >
            <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            View All Blog Posts
          </Link>
        </div>
      </div>
    </div>
  );
}