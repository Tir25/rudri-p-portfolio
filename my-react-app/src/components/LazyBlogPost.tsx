import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';

// Lazy load the BlogPost component
const BlogPost = lazy(() => import('../pages/BlogPost'));

export default function LazyBlogPost() {
  return (
    <Suspense fallback={
      <div className="py-16 text-center">
        <motion.div 
          className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="mt-4 text-academic-600">Loading article...</p>
      </div>
    }>
      <BlogPost />
    </Suspense>
  );
}