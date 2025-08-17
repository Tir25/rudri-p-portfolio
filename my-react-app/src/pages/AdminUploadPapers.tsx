import React, { useState } from 'react';

import { createPaper, type CreatePaperData } from '../services/supabasePaperService';
import { toast } from 'react-hot-toast';

export default function AdminUploadPapers() {

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    abstract: '',
    category: '',
    keywords: '',
    published: true
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB');
        return;
      }
      setPdfFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pdfFile) {
      toast.error('Please select a PDF file');
      return;
    }

    if (!formData.title.trim() || !formData.authors.trim()) {
      toast.error('Title and authors are required');
      return;
    }

    setLoading(true);
    try {
      // Parse authors from comma-separated string
      const authors = formData.authors.split(',').map(author => author.trim()).filter(Boolean);
      
      // Parse keywords from comma-separated string
      const keywords = formData.keywords.split(',').map(keyword => keyword.trim()).filter(Boolean);

      const paperData: CreatePaperData = {
        title: formData.title.trim(),
        authors,
        abstract: formData.abstract.trim() || undefined,
        category: formData.category.trim() || undefined,
        keywords: keywords.length > 0 ? keywords : undefined,
        pdf_file: pdfFile,
        published: formData.published
      };

      await createPaper(paperData);
      toast.success('Research paper uploaded successfully!');
      
      // Reset form
      setFormData({
        title: '',
        authors: '',
        abstract: '',
        category: '',
        keywords: '',
        published: true
      });
      setPdfFile(null);
      const fileInput = document.getElementById('pdf-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Error uploading paper:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload paper');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-academic-900">Upload Research Papers</h1>
        <p className="text-academic-600">Upload and manage research papers</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-academic-700 mb-2">
              Paper Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-academic-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter paper title"
            />
          </div>

          {/* Authors */}
          <div>
            <label htmlFor="authors" className="block text-sm font-medium text-academic-700 mb-2">
              Authors *
            </label>
            <input
              type="text"
              id="authors"
              name="authors"
              value={formData.authors}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-academic-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter authors (comma-separated)"
            />
            <p className="text-sm text-academic-500 mt-1">Separate multiple authors with commas</p>
          </div>

          {/* Abstract */}
          <div>
            <label htmlFor="abstract" className="block text-sm font-medium text-academic-700 mb-2">
              Abstract
            </label>
            <textarea
              id="abstract"
              name="abstract"
              value={formData.abstract}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-academic-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter paper abstract"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-academic-700 mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-academic-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Physics">Physics</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Biology">Biology</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Engineering">Engineering</option>
              <option value="Economics">Economics</option>
              <option value="Psychology">Psychology</option>
              <option value="Medicine">Medicine</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Keywords */}
          <div>
            <label htmlFor="keywords" className="block text-sm font-medium text-academic-700 mb-2">
              Keywords
            </label>
            <input
              type="text"
              id="keywords"
              name="keywords"
              value={formData.keywords}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-academic-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter keywords (comma-separated)"
            />
            <p className="text-sm text-academic-500 mt-1">Separate keywords with commas</p>
          </div>

          {/* PDF File */}
          <div>
            <label htmlFor="pdf-file" className="block text-sm font-medium text-academic-700 mb-2">
              PDF File *
            </label>
            <input
              type="file"
              id="pdf-file"
              accept=".pdf"
              onChange={handleFileChange}
              required
              className="w-full px-3 py-2 border border-academic-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-sm text-academic-500 mt-1">
              Maximum file size: 10MB. Only PDF files are accepted.
            </p>
            {pdfFile && (
              <p className="text-sm text-green-600 mt-1">
                Selected: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Published */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              name="published"
              checked={formData.published}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-academic-300 rounded"
            />
            <label htmlFor="published" className="ml-2 block text-sm text-academic-700">
              Publish immediately
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Uploading...' : 'Upload Paper'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}