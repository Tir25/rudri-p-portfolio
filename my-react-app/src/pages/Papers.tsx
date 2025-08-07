import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  DocumentTextIcon, 
  ArrowDownTrayIcon, 
  AcademicCapIcon,
  CalendarIcon,
  NewspaperIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { papersAPI } from '../services/api';

interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  keywords: string[];
  category: string;
  file_path: string;
  published: boolean;
  uploaded_by: number;
  upload_date: string;
  updated_at: string;
}

export default function Papers() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'year' | 'title'>('year');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [years, setYears] = useState<string[]>(['All']);
  
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        const response = await papersAPI.getAllPapers();
        setPapers(response);
        
        // Extract unique categories and years
        const uniqueCategories = ['All', ...new Set(response.map((paper: Paper) => paper.category).filter(Boolean))] as string[];
        setCategories(uniqueCategories);
        
        const uniqueYears = ['All', ...new Set(response.map((paper: Paper) => 
          new Date(paper.upload_date).getFullYear().toString()
        ))] as string[];
        setYears(uniqueYears.sort((a, b) => b.localeCompare(a))); // Sort years in descending order
      } catch (error) {
        console.error('Error fetching papers:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPapers();
  }, []);

  // Filter papers based on search term, category, and year
  const filteredPapers = papers.filter(paper => {
    const matchesSearch = 
      searchTerm === '' || 
      paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(paper.authors) ? paper.authors.join(', ').toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      (paper.abstract ? paper.abstract.toLowerCase().includes(searchTerm.toLowerCase()) : false);
    
    const matchesCategory = 
      selectedCategory === 'All' || 
      paper.category === selectedCategory;
    
    const paperYear = new Date(paper.upload_date).getFullYear().toString();
    const matchesYear = 
      selectedYear === 'All' || 
      paperYear === selectedYear;
    
    return matchesSearch && matchesCategory && matchesYear;
  });

  // Sort papers
  const sortedPapers = [...filteredPapers].sort((a, b) => {
    if (sortBy === 'year') {
      const yearA = new Date(a.upload_date).getFullYear();
      const yearB = new Date(b.upload_date).getFullYear();
      return sortDirection === 'asc' ? yearA - yearB : yearB - yearA;
    } else {
      // Sort by title
      return sortDirection === 'asc' 
        ? a.title.localeCompare(b.title) 
        : b.title.localeCompare(a.title);
    }
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
        duration: 0.5
      }
    }
  };

  const handleSortToggle = (field: 'year' | 'title') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };
  
  const getDownloadUrl = (paperId: string) => {
    return `/api/papers/${paperId}/download`;
  };

  return (
    <div className="space-y-12 py-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h1 
          className="text-5xl md:text-6xl font-serif font-semibold mb-6 relative inline-block"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="bg-gradient-to-r from-primary-700 to-academic-800 text-transparent bg-clip-text">My Papers</span>
          <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-primary-500 to-transparent rounded-full"></span>
        </motion.h1>
        <motion.p 
          className="text-xl text-academic-700 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          A collection of my published academic papers and research contributions in statistics, 
          research methodology, and educational assessment.
        </motion.p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-academic-600">Loading papers...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Filters and Search */}
          <motion.div 
            className="max-w-6xl mx-auto space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-academic-400" />
              </div>
              <input
                type="text"
                placeholder="Search papers by title, author, abstract..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 border border-academic-200 rounded-xl leading-5 bg-white placeholder-academic-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-all duration-200"
              />
            </div>

            {/* Filters and View Toggle */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-wrap gap-4 w-full sm:w-auto">
                {/* Category Filter */}
                <div className="relative w-full sm:w-auto">
                  <label htmlFor="category-filter" className="sr-only">Filter by category</label>
                  <select
                    id="category-filter"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none w-full sm:w-auto pl-10 pr-10 py-3 border border-academic-200 rounded-lg bg-white text-academic-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer shadow-sm"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <TagIcon className="h-5 w-5 text-academic-400" />
                  </div>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-academic-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Year Filter */}
                <div className="relative w-full sm:w-auto">
                  <label htmlFor="year-filter" className="sr-only">Filter by year</label>
                  <select
                    id="year-filter"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="appearance-none w-full sm:w-auto pl-10 pr-10 py-3 border border-academic-200 rounded-lg bg-white text-academic-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer shadow-sm"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-academic-400" />
                  </div>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-academic-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-academic-100 rounded-lg p-1 shadow-sm self-end sm:self-auto">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-academic-600'}`}
                  aria-label="Grid view"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-white shadow-sm text-primary-600' : 'text-academic-600'}`}
                  aria-label="Table view"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Results Count */}
          <div className="max-w-6xl mx-auto">
            <p className="text-academic-600">
              Showing {sortedPapers.length} {sortedPapers.length === 1 ? 'paper' : 'papers'}
            </p>
          </div>

          {/* Papers Display */}
          {viewMode === 'grid' ? (
            <motion.div 
              className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {sortedPapers.map((paper) => (
                <motion.div 
                  key={paper.id} 
                  className="card flex flex-col h-full overflow-hidden group"
                  variants={itemVariants}
                  whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {new Date(paper.upload_date).getFullYear()}
                      </span>
                      <span className="inline-flex items-center text-xs text-academic-500">
                        <AcademicCapIcon className="h-4 w-4 mr-1" />
                        {paper.category || 'Uncategorized'}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-serif font-semibold text-academic-900 mb-3 line-clamp-2">
                      {paper.title}
                    </h3>
                    
                    <p className="text-academic-600 mb-3 text-sm">
                      {Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors}
                    </p>
                    
                    <div className="flex items-center text-academic-500 text-sm mb-4">
                      <NewspaperIcon className="h-4 w-4 mr-1" />
                      <span className="italic">{paper.file_path ? paper.file_path.split('/').pop() : 'No file'}</span>
                    </div>
                    
                    <p className="text-academic-700 line-clamp-3 text-sm mb-4">
                      {paper.abstract}
                    </p>
                  </div>
                  
                  <div className="border-t border-academic-100 p-4">
                    <a 
                      href={getDownloadUrl(paper.id)}
                      className="btn-primary w-full text-center inline-flex items-center justify-center gap-2 group relative overflow-hidden"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                      <ArrowDownTrayIcon className="h-5 w-5 relative" />
                      <span className="relative">Download Paper</span>
                    </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="overflow-x-auto rounded-xl shadow-academic-sm">
              {/* Desktop Table View */}
              <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-academic-sm hidden md:table">
                <thead className="bg-academic-50 text-academic-700">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium text-sm">
                      <button 
                        className="flex items-center gap-1 hover:text-primary-700"
                        onClick={() => handleSortToggle('title')}
                      >
                        Title
                        {sortBy === 'title' && (
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-4 w-4" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            {sortDirection === 'asc' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            )}
                          </svg>
                        )}
                      </button>
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-sm">Authors</th>
                    <th className="py-3 px-4 text-left font-medium text-sm">Journal</th>
                    <th className="py-3 px-4 text-left font-medium text-sm">
                      <button 
                        className="flex items-center gap-1 hover:text-primary-700"
                        onClick={() => handleSortToggle('year')}
                      >
                        Year
                        {sortBy === 'year' && (
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-4 w-4" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            {sortDirection === 'asc' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            )}
                          </svg>
                        )}
                      </button>
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-sm">Category</th>
                    <th className="py-3 px-4 text-left font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-academic-100">
                  {sortedPapers.map((paper) => (
                    <tr key={paper.id} className="hover:bg-academic-50 transition-colors duration-200">
                      <td className="py-4 px-4">
                        <div className="max-w-xs">
                          <h3 className="font-medium text-academic-900 line-clamp-2">{paper.title}</h3>
                          <p className="text-sm text-academic-600 line-clamp-2 mt-1">{paper.abstract}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-academic-700">
                          {Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-academic-600 italic">
                          {paper.file_path ? paper.file_path.split('/').pop() : 'No file'}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-academic-600">
                          {new Date(paper.upload_date).getFullYear()}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-academic-100 text-academic-800">
                          {paper.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <a 
                          href={getDownloadUrl(paper.id)}
                          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 transition-colors duration-200"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                          <span className="text-sm">Download</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Table View */}
              <div className="md:hidden space-y-4">
                {sortedPapers.map((paper, index) => (
                  <motion.div 
                    key={paper.id}
                    className="bg-white rounded-lg shadow-sm border border-academic-100 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <div className="p-4 border-b border-academic-100 bg-academic-50">
                      <div className="font-medium text-academic-900">{paper.title}</div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1 text-sm text-academic-500">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{new Date(paper.upload_date).getFullYear()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-academic-500">
                        <AcademicCapIcon className="h-4 w-4" />
                        <span>{paper.category || 'Uncategorized'}</span>
                      </div>
                      </div>
                      
                      <div className="text-sm">
                        <span className="text-academic-500">Authors: </span>
                        <span className="text-academic-700">{Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors}</span>
                      </div>
                      
                      <div className="text-sm">
                        <span className="text-academic-500">File: </span>
                        <span className="text-academic-700 italic">{paper.file_path ? paper.file_path.split('/').pop() : 'No file'}</span>
                      </div>
                      
                      <a 
                        href={getDownloadUrl(paper.id)}
                        className="mt-3 w-full inline-flex items-center justify-center gap-2 p-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors duration-200"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ArrowDownTrayIcon className="h-5 w-5" />
                        <span>Download Paper</span>
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {sortedPapers.length === 0 && (
            <div className="text-center py-12">
              <DocumentTextIcon className="h-16 w-16 mx-auto text-academic-300" />
              <h3 className="mt-4 text-xl font-medium text-academic-900">No papers found</h3>
              <p className="mt-2 text-academic-600">Try adjusting your search or filter criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSelectedYear('All');
                }}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Citation Information */}
          <div className="max-w-4xl mx-auto mt-16 p-6 sm:p-8 bg-white shadow-academic-sm rounded-xl">
            <h2 className="text-2xl font-serif font-semibold text-academic-900 mb-4 relative inline-block">
              <span className="bg-gradient-to-r from-primary-700 to-academic-800 text-transparent bg-clip-text">How to Cite</span>
              <span className="absolute -bottom-1 left-0 w-1/4 h-1 bg-gradient-to-r from-primary-500 to-transparent rounded-full"></span>
            </h2>
            <p className="text-academic-700 mb-6">
              When referencing any of these papers, please use the appropriate citation format for your field. 
              Each paper includes a DOI that can be used to generate citations in various formats.
            </p>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-academic-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-primary-600">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <AcademicCapIcon className="h-5 w-5 text-primary-600" />
                </div>
                <span className="font-medium">Google Scholar Profile:</span>
              </div>
              <a 
                href="https://scholar.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-800 font-medium hover:underline transition-colors duration-200 flex items-center gap-1"
              >
                <span>Rudri Dave</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            
            <div className="mt-6 text-sm text-academic-500 text-center sm:text-left">
              <p>Last updated: August 2024</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}