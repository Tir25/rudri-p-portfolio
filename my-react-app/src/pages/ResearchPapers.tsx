import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DocumentTextIcon, CalendarIcon, UserIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { getPublishedPapers, getPaperCategories, type Paper } from '../services/supabasePaperService';

export default function ResearchPapers() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [papersData, categoriesData] = await Promise.all([
          getPublishedPapers(),
          getPaperCategories()
        ]);
        setPapers(papersData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching papers:', err);
        setError('Failed to load research papers');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPapers = selectedCategory === 'all' 
    ? papers 
    : papers.filter(paper => paper.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-academic-600">Loading research papers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] py-12 px-4 sm:px-6 lg:px-8 bg-academic-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-academic-900 mb-4">Research Papers</h1>
          <p className="text-xl text-academic-600">Academic research and publications</p>
        </div>

        {error && (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {categories.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-academic-700 hover:bg-academic-100'
                }`}
              >
                All Papers
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-academic-700 hover:bg-academic-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {filteredPapers.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-12 w-12 text-academic-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-academic-900 mb-2">No research papers available</h3>
            <p className="text-academic-600">Check back soon for new research papers!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPapers.map((paper) => (
              <motion.div
                key={paper.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-academic-900 mb-2">
                    {paper.title}
                  </h2>
                  <p className="text-academic-600 mb-4 line-clamp-3">{paper.abstract}</p>
                  
                  <div className="flex items-center justify-between text-sm text-academic-500 mb-4">
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-1" />
                      {Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors}
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {new Date(paper.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-full">
                      {paper.category}
                    </span>
                  </div>
                  
                  {paper.keywords && paper.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {paper.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-academic-100 text-academic-700 rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}

                  {paper.file_url && (
                    <a
                      href={paper.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
                    >
                                             <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                      Download PDF
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}