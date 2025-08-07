import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, CalendarIcon, UserIcon, TagIcon, ClockIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { blogsAPI } from '../services/api';
import ScrollToTop from '../components/ScrollToTop';

// Define the BlogPost type
interface BlogPost {
  id: string;
  title: string;
  content: string;
  author?: string;
  date?: string;
  tags?: string[];
  image?: string;
  cover_image?: string;
  readTime?: string;
  slug?: string;
  created_at?: string;
  updated_at?: string;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!slug) {
      toast.error('Blog post not found');
      navigate('/blog');
      return;
    }

    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const response = await blogsAPI.getBlogById(slug);
        setPost(response);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        toast.error('Failed to load blog post');
        navigate('/blog');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-academic-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-academic-600">Loading blog post...</p>
        </div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="min-h-screen bg-academic-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-academic-900 mb-4">Blog Post Not Found</h1>
          <p className="text-academic-600 mb-6">The blog post you're looking for doesn't exist.</p>
          <Link 
            to="/blog" 
            className="btn-primary"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-academic-50">
        {/* Header */}
        <motion.header 
          className="bg-white shadow-academic-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <Link 
                to="/blog" 
                className="btn-secondary flex items-center gap-2"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                Back to Blog
              </Link>
              
              <div className="text-sm text-academic-500">
                {post.created_at && new Date(post.created_at).toLocaleDateString()}
              </div>
            </div>
        </div>
        </motion.header>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.article 
            className="bg-white rounded-2xl shadow-academic-sm p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-academic-900 mb-6">
            {post.title}
        </h1>
        
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 mb-8 text-academic-600">
              {post.author && (
          <div className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  <span>{post.author}</span>
            </div>
              )}
              
              {post.created_at && (
          <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
              )}
              
              {post.readTime && (
          <div className="flex items-center gap-2">
                  <ClockIcon className="h-5 w-5" />
                  <span>{post.readTime}</span>
            </div>
              )}
        </div>
        
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
                  <span 
              key={tag} 
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-academic-100 text-academic-700"
            >
              <TagIcon className="h-4 w-4" />
              {tag}
                  </span>
          ))}
        </div>
            )}

            {/* Featured Image */}
            {post.cover_image && (
              <div className="mb-8">
                <img 
                  src={`http://localhost:4000${post.cover_image}`}
                  alt={post.title} 
                  className="w-full h-64 object-cover rounded-lg shadow-academic-md"
                />
              </div>
            )}
      
      {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-academic-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
          </div>
          
            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-academic-100">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-academic-500">
                  © {new Date().getFullYear()} Rudri Dave. All rights reserved.
                    </div>
                    
                <div className="flex gap-4">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-academic-600 hover:text-primary-600 transition-colors duration-200 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
              </svg>
              Back to top
            </button>
          </div>
        </div>
            </div>
          </motion.article>
        </div>
      </div>
    </>
  );
}