import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  DocumentTextIcon, 
  ArrowUpTrayIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { papersAPI } from '../services/api';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

interface PaperMetadata {
  title: string;
  authors: string;
  keywords: string;
  category: string;
  abstract: string;
}

export default function AdminUploadPapers() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [metadata, setMetadata] = useState<PaperMetadata>({
    title: '',
    authors: '',
    keywords: '',
    category: '',
    abstract: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Only handle one file at a time for now
    const file = files[0];
    
    const newFile: UploadedFile = {
      id: `file-${Date.now()}`,
      name: file.name,
      size: file.size,
      status: 'uploading'
    };

    setUploadedFiles(prev => [...prev, newFile]);
    setIsUploading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', metadata.title || file.name.replace('.pdf', ''));
      formData.append('authors', metadata.authors);
      formData.append('keywords', metadata.keywords);
      formData.append('category', metadata.category);
      formData.append('abstract', metadata.abstract);

      // Upload file using API
      const response = await papersAPI.createPaper(formData);
      
      if (response) {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === newFile.id 
              ? { ...f, status: 'success' }
              : f
          )
        );
        toast.success('Paper uploaded successfully!');
        
        // Reset form
        setMetadata({
          title: '',
          authors: '',
          keywords: '',
          category: '',
          abstract: ''
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload paper');
      
      // Mark file as failed
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === newFile.id 
            ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'Unknown error' }
            : f
        )
      );
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center mb-6">
          <DocumentTextIcon className="h-8 w-8 text-primary-600 mr-3" />
          <h1 className="text-2xl font-serif font-semibold text-academic-900">
            Upload Research Papers
          </h1>
        </div>

        <div className="space-y-6">
          {/* Paper Metadata Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-academic-900">Paper Information</h3>
            
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-academic-700 mb-1">
                Paper Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={metadata.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-academic-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter the title of your research paper"
              />
            </div>
            
            {/* Authors */}
            <div>
              <label htmlFor="authors" className="block text-sm font-medium text-academic-700 mb-1">
                Authors (comma-separated)
              </label>
              <input
                type="text"
                id="authors"
                name="authors"
                value={metadata.authors}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-academic-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g. Rudri Dave, John Smith"
              />
            </div>
            
            {/* Keywords */}
            <div>
              <label htmlFor="keywords" className="block text-sm font-medium text-academic-700 mb-1">
                Keywords (comma-separated)
              </label>
              <input
                type="text"
                id="keywords"
                name="keywords"
                value={metadata.keywords}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-academic-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g. statistics, education, research"
              />
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-academic-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={metadata.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-academic-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select a category</option>
                <option value="Statistics">Statistics</option>
                <option value="Research Methods">Research Methods</option>
                <option value="Education">Education</option>
                <option value="Data Analysis">Data Analysis</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>
            
            {/* Abstract */}
            <div>
              <label htmlFor="abstract" className="block text-sm font-medium text-academic-700 mb-1">
                Abstract
              </label>
              <textarea
                id="abstract"
                name="abstract"
                value={metadata.abstract}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-academic-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter a brief abstract of your research paper"
              />
            </div>
          </div>
          
          {/* Upload Area */}
          <div className="border-2 border-dashed border-academic-300 rounded-lg p-8 text-center">
            <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-academic-400 mb-4" />
            <h3 className="text-lg font-medium text-academic-900 mb-2">
              Upload Research Paper
            </h3>
            <p className="text-academic-600 mb-4">
              Drag and drop your PDF file here, or click to browse
            </p>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
              id="file-upload"
              ref={fileInputRef}
            />
            <label
              htmlFor="file-upload"
              className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
              {isUploading ? 'Uploading...' : 'Choose File'}
            </label>
            <p className="text-xs text-academic-500 mt-2">
              Maximum file size: 10MB
            </p>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-academic-900">Uploaded Files</h3>
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 bg-academic-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-5 w-5 text-academic-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-academic-900">{file.name}</p>
                        <p className="text-xs text-academic-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {file.status === 'uploading' && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                      )}
                      {file.status === 'success' && (
                        <CheckIcon className="h-5 w-5 text-green-600" />
                      )}
                      {file.status === 'error' && (
                        <XMarkIcon className="h-5 w-5 text-red-600" />
                      )}
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-academic-400 hover:text-academic-600"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Upload Guidelines</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Only PDF files are accepted</li>
              <li>• Maximum file size: 10MB per file</li>
              <li>• Files will be automatically processed and indexed</li>
              <li>• You can upload multiple files at once</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}