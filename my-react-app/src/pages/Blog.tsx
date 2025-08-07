import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, CalendarIcon, UserIcon, TagIcon, ClockIcon } from '@heroicons/react/24/outline';
import blogsAPI from '../services/blogsAPI';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  tags: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
  cover_image?: string;
}

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load blogs from API with offline fallback
  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from API
        const response = await blogsAPI.getAllBlogs();
        
        if (response && Array.isArray(response)) {
          // Filter only published blogs
          const publishedBlogs = response.filter(blog => blog.published);
          setBlogPosts(publishedBlogs);
          
          // Store in localStorage for offline access
          localStorage.setItem('cachedBlogs', JSON.stringify(publishedBlogs));
          localStorage.setItem('blogsLastUpdated', new Date().toISOString());
          
          console.log(`✅ Loaded ${publishedBlogs.length} published blogs from API`);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.warn('⚠️ Failed to load blogs from API, using cached data:', error);
        
        // Try to load from localStorage as fallback
        const cachedBlogs = localStorage.getItem('cachedBlogs');
        if (cachedBlogs) {
          try {
            const parsedBlogs = JSON.parse(cachedBlogs);
            const publishedBlogs = parsedBlogs.filter((blog: BlogPost) => blog.published);
            setBlogPosts(publishedBlogs);
            setError('Showing cached blogs (offline mode)');
            console.log(`📱 Loaded ${publishedBlogs.length} cached blogs`);
          } catch (parseError) {
            console.error('❌ Failed to parse cached blogs:', parseError);
            setBlogPosts([]);
            setError('Failed to load blogs');
          }
        } else {
          setBlogPosts([]);
          setError('No blogs available');
        }
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  // Extract all unique tags from blog posts
  const allTags = Array.from(
    new Set(
      blogPosts.flatMap(post => post.tags || [])
    )
  ).sort();

  // Filter posts based on search term and selected tag
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.content && post.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesTag = selectedTag === null || (post.tags && post.tags.includes(selectedTag));
    
    return matchesSearch && matchesTag;
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to estimate read time
  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="space-y-16 py-12">
        <div className="text-center space-y-4">
          <motion.h1 
            className="text-5xl md:text-6xl font-serif font-semibold mb-6 relative inline-block"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-primary-700 to-academic-800 text-transparent bg-clip-text">Blog & Insights</span>
          </motion.h1>
        </div>
        
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-academic-600">Loading blogs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 py-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h1 
          className="text-5xl md:text-6xl font-serif font-semibold mb-6 relative inline-block"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="bg-gradient-to-r from-primary-700 to-academic-800 text-transparent bg-clip-text">Blog & Insights</span>
          <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-primary-500 to-transparent rounded-full"></span>
        </motion.h1>
        <motion.p 
          className="text-xl text-academic-700 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Explore my latest articles and insights on statistics, research methodology, and bridging theory with practice.
        </motion.p>
        
        {/* Offline indicator */}
        {error && error.includes('offline') && (
          <motion.div 
            className="max-w-md mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <p className="text-sm text-yellow-800">
              📱 {error} - You're viewing cached content
            </p>
          </motion.div>
        )}
      </div>

      {/* Search and Filter */}
      <motion.div 
        className="max-w-4xl mx-auto space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-academic-400" />
          </div>
          <input
            type="text"
            placeholder="Search articles by title, content, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-12 pr-4 py-3 border border-academic-200 rounded-xl leading-5 bg-white placeholder-academic-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-all duration-200"
          />
        </div>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-academic-600 font-medium">Filter by tag:</span>
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedTag === null
                  ? 'bg-primary-600 text-white shadow-md transform scale-105'
                  : 'bg-academic-100 text-academic-700 hover:bg-academic-200'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  selectedTag === tag
                    ? 'bg-primary-600 text-white shadow-md transform scale-105'
                    : 'bg-academic-100 text-academic-700 hover:bg-academic-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Blog Posts Grid */}
      <motion.div 
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredPosts.map((post, index) => (
          <motion.article 
            key={post.id}
            variants={itemVariants}
            className="card hover:shadow-academic-lg transition-all duration-500 transform hover:-translate-y-2 overflow-hidden group"
          >
            {/* Image with blur-up effect */}
            <div className="h-48 overflow-hidden relative">
              {post.cover_image ? (
                <img 
                  src={`http://localhost:4000${post.cover_image}`}
                  alt={post.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                />
              ) : (
                <div 
                  className={`w-full h-full bg-gradient-to-br from-primary-${(index % 5) * 100 + 300} to-academic-${(index % 5) * 100 + 300} transition-all duration-700 group-hover:scale-110`}
                  style={{
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Blur-up loading effect */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center text-white font-serif text-2xl"
                  >
                    <span className="opacity-30">{post.title.split(' ')[0]}</span>
                  </motion.div>
                </div>
              )}
              <div className="absolute top-4 right-4 z-10">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-primary-700 shadow-md backdrop-blur-sm">
                  <ClockIcon className="h-3 w-3 mr-1" />
                  {estimateReadTime(post.content)}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 transition-all duration-300 hover:bg-primary-200 cursor-pointer"
                      onClick={() => setSelectedTag(tag)}
                    >
                      <TagIcon className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Title */}
              <h2 className="text-xl font-serif font-semibold text-academic-900 line-clamp-2 group-hover:text-primary-700 transition-colors duration-300">
                {post.title}
              </h2>
              
              {/* Excerpt */}
              <p className="text-academic-600 line-clamp-3">
                {post.content.substring(0, 150)}...
              </p>
              
              {/* Metadata */}
              <div className="flex items-center justify-between pt-4 border-t border-academic-100">
                <div className="flex items-center gap-2 text-sm text-academic-500">
                  <UserIcon className="h-4 w-4" />
                  Rudri Dave
                </div>
                <div className="flex items-center gap-1 text-sm text-academic-500">
                  <CalendarIcon className="h-4 w-4" />
                  {formatDate(post.created_at)}
                </div>
              </div>
              
              {/* Read More Button */}
              <Link
                to={`/blog/${post.slug}`}
                className="block w-full text-center btn-primary group-hover:shadow-lg transition-all duration-300"
              >
                Read Article
              </Link>
            </div>
          </motion.article>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <motion.div 
          className="text-center py-16 bg-academic-50 rounded-xl shadow-inner"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto h-16 w-16 text-academic-400">
            <MagnifyingGlassIcon className="h-16 w-16" />
          </div>
          <h3 className="mt-4 text-xl font-serif font-medium text-academic-900">No articles found</h3>
          <p className="mt-2 text-academic-600 max-w-md mx-auto">
            {blogPosts.length === 0 
              ? "No blog posts are available yet. Check back soon for new articles!"
              : "Try adjusting your search or filter criteria to find what you're looking for."
            }
          </p>
          {blogPosts.length > 0 && (
            <button 
              onClick={() => {setSearchTerm(''); setSelectedTag(null);}}
              className="mt-6 btn-secondary"
            >
              Clear Filters
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}