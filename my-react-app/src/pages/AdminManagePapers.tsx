import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  DocumentTextIcon, 
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  UserIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { papersAPI } from '../services/api';

interface Paper {
  id: string;
  title: string;
  authors: string[];
  keywords: string[];
  category: string;
  abstract: string;
  file_path: string;
  published: boolean;
  uploaded_by: number;
  upload_date: string;
  updated_at: string;
}

export default function AdminManagePapers() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPapers = async () => {
    try {
      setLoading(true);
      const response = await papersAPI.getAllPapers();
      setPapers(response);
    } catch (error) {
      console.error('Error fetching papers:', error);
      toast.error('Failed to load papers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  const handleDeletePaper = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this paper? This action cannot be undone.')) {
      try {
        await papersAPI.deletePaper(id);
        setPapers(papers.filter(paper => paper.id !== id));
        toast.success('Paper deleted successfully');
      } catch (error) {
        console.error('Error deleting paper:', error);
        toast.error('Failed to delete paper');
      }
    }
  };
  
  const getDownloadUrl = (paperId: string) => {
    return `/api/papers/${paperId}/download`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-academic-600">Loading papers...</p>
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
              Manage Research Papers
            </h1>
          </div>
          <button 
            onClick={fetchPapers}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>

        {papers.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-12 w-12 text-academic-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-academic-900 mb-2">No papers found</h3>
            <p className="text-academic-600">Upload your first research paper to get started.</p>
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
                    Authors
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-academic-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-academic-500 uppercase tracking-wider">
                    Upload Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-academic-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-academic-200">
                {papers.map((paper) => (
                  <tr key={paper.id} className="hover:bg-academic-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-academic-900">{paper.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 text-academic-400 mr-2" />
                        <span className="text-sm text-academic-900">{Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-academic-100 text-academic-800">
                        {paper.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 text-academic-400 mr-2" />
                        <span className="text-sm text-academic-900">
                          {new Date(paper.upload_date).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <a
                          href={getDownloadUrl(paper.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-900 p-1 rounded"
                          title="Download Paper"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => handleDeletePaper(paper.id)}
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