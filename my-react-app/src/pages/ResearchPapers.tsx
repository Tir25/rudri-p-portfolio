import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DocumentTextIcon, CalendarIcon, UserGroupIcon, TagIcon, ArrowDownTrayIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { papersAPI } from '../services/api';
import type { Paper } from '../types/global';

export default function ResearchPapers() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        const response = await papersAPI.getAllPapers();
        setPapers(response);
      } catch (error) {
        console.error('Error fetching papers:', error);
        toast.error('Failed to load research papers');
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (paper.abstract && paper.abstract.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || paper.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(papers.map(paper => paper.category)))];

  if (loading) {
    return (
      <div className="min-h-screen bg-academic-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-academic-600">Loading research papers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-academic-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-serif font-bold text-academic-900 mb-4">
            <span className="bg-gradient-to-r from-primary-700 to-academic-800 text-transparent bg-clip-text">
              Research Papers
            </span>
          </h1>
          <p className="text-lg text-academic-600 max-w-3xl mx-auto">
            Explore my collection of research papers and academic publications
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-academic-400" />
              <input
                type="text"
                placeholder="Search papers by title, author, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-academic-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-academic-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Papers Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredPapers.map((paper, index) => (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <DocumentTextIcon className="h-8 w-8 text-primary-600 flex-shrink-0" />
                  <span className="text-xs text-academic-500 bg-academic-100 px-2 py-1 rounded-full">
                    {paper.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-academic-900 mb-2 line-clamp-2">
                  {paper.title}
                </h3>
                
                <div className="flex items-center text-sm text-academic-500 mb-3">
                  <UserGroupIcon className="h-4 w-4 mr-1" />
                  <span className="line-clamp-1">{paper.authors.join(', ')}</span>
                </div>
                
                <p className="text-sm text-academic-600 mb-4 line-clamp-3">
                  {paper.abstract}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-academic-500">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>{new Date(paper.uploadDate).toLocaleDateString()}</span>
                  </div>
                  
                  <a
                    href={paper.pdfUrl}
                    className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                    Download
                  </a>
                </div>
                
                {paper.keywords.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1">
                    {paper.keywords.slice(0, 3).map((keyword, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-academic-100 text-academic-700"
                      >
                        <TagIcon className="h-3 w-3 mr-1" />
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredPapers.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <DocumentTextIcon className="h-12 w-12 text-academic-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-academic-900 mb-2">No papers found</h3>
            <p className="text-academic-600">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search criteria'
                : 'No research papers are currently available'
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}