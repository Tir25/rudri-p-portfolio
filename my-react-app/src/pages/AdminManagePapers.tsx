import React, { useState, useEffect } from 'react';

import { getAllPapers, deletePaper, updatePaper, type Paper } from '../services/supabasePaperService';
import { toast } from 'react-hot-toast';
import { DocumentTextIcon, TrashIcon, PencilIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function AdminManagePapers() {

  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPaper, setEditingPaper] = useState<Paper | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      setLoading(true);
      const papersData = await getAllPapers();
      setPapers(papersData);
    } catch (err) {
      console.error('Error fetching papers:', err);
      setError('Failed to load papers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (paperId: string) => {
    if (!confirm('Are you sure you want to delete this paper? This action cannot be undone.')) {
      return;
    }

    try {
      await deletePaper(paperId);
      toast.success('Paper deleted successfully');
      fetchPapers(); // Refresh the list
    } catch (error) {
      console.error('Error deleting paper:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete paper');
    }
  };

  const handleTogglePublished = async (paper: Paper) => {
    try {
      await updatePaper(paper.id, { published: !paper.published });
      toast.success(`Paper ${paper.published ? 'unpublished' : 'published'} successfully`);
      fetchPapers(); // Refresh the list
    } catch (error) {
      console.error('Error updating paper:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update paper');
    }
  };

  const handleEdit = (paper: Paper) => {
    setEditingPaper(paper);
    setShowEditForm(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPaper) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get('title') as string;
    const authors = formData.get('authors') as string;
    const abstract = formData.get('abstract') as string;
    const category = formData.get('category') as string;
    const keywords = formData.get('keywords') as string;
    const published = formData.get('published') === 'on';

    try {
      const authorsArray = authors.split(',').map(author => author.trim()).filter(Boolean);
      const keywordsArray = keywords.split(',').map(keyword => keyword.trim()).filter(Boolean);

      await updatePaper(editingPaper.id, {
        title: title.trim(),
        authors: authorsArray,
        abstract: abstract.trim() || undefined,
        category: category.trim() || undefined,
        keywords: keywordsArray.length > 0 ? keywordsArray : undefined,
        published
      });

      toast.success('Paper updated successfully');
      setShowEditForm(false);
      setEditingPaper(null);
      fetchPapers(); // Refresh the list
    } catch (error) {
      console.error('Error updating paper:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update paper');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-academic-900">Manage Research Papers</h1>
          <p className="text-academic-600">Manage and organize your research papers</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-academic-900">Manage Research Papers</h1>
        <p className="text-academic-600">Manage and organize your research papers</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {showEditForm && editingPaper && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-academic-900 mb-4">Edit Paper</h2>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label htmlFor="edit-title" className="block text-sm font-medium text-academic-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="edit-title"
                name="title"
                defaultValue={editingPaper.title}
                required
                className="w-full px-3 py-2 border border-academic-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="edit-authors" className="block text-sm font-medium text-academic-700 mb-2">
                Authors *
              </label>
              <input
                type="text"
                id="edit-authors"
                name="authors"
                defaultValue={editingPaper.authors.join(', ')}
                required
                className="w-full px-3 py-2 border border-academic-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="edit-abstract" className="block text-sm font-medium text-academic-700 mb-2">
                Abstract
              </label>
              <textarea
                id="edit-abstract"
                name="abstract"
                defaultValue={editingPaper.abstract || ''}
                rows={3}
                className="w-full px-3 py-2 border border-academic-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="edit-category" className="block text-sm font-medium text-academic-700 mb-2">
                Category
              </label>
              <select
                id="edit-category"
                name="category"
                defaultValue={editingPaper.category || ''}
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

            <div>
              <label htmlFor="edit-keywords" className="block text-sm font-medium text-academic-700 mb-2">
                Keywords
              </label>
              <input
                type="text"
                id="edit-keywords"
                name="keywords"
                defaultValue={editingPaper.keywords.join(', ')}
                className="w-full px-3 py-2 border border-academic-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="edit-published"
                name="published"
                defaultChecked={editingPaper.published}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-academic-300 rounded"
              />
              <label htmlFor="edit-published" className="ml-2 block text-sm text-academic-700">
                Published
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowEditForm(false);
                  setEditingPaper(null);
                }}
                className="px-4 py-2 text-academic-700 bg-white border border-academic-300 rounded-md hover:bg-academic-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Update Paper
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-academic-200">
          <h2 className="text-lg font-medium text-academic-900">All Papers ({papers.length})</h2>
        </div>

        {papers.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-12 w-12 text-academic-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-academic-900 mb-2">No papers found</h3>
            <p className="text-academic-600">Upload your first research paper to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-academic-200">
              <thead className="bg-academic-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-academic-500 uppercase tracking-wider">
                    Paper
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-academic-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-academic-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-academic-500 uppercase tracking-wider">
                    Date
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
                      <div>
                        <div className="text-sm font-medium text-academic-900">{paper.title}</div>
                        <div className="text-sm text-academic-500">
                          {paper.authors.join(', ')}
                        </div>
                        {paper.abstract && (
                          <div className="text-sm text-academic-600 mt-1 line-clamp-2">
                            {paper.abstract}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                        {paper.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        paper.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {paper.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-academic-500">
                      {new Date(paper.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {paper.file_url && (
                          <a
                            href={paper.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-900"
                            title="View PDF"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </a>
                        )}
                        <button
                          onClick={() => handleEdit(paper)}
                          className="text-academic-600 hover:text-academic-900"
                          title="Edit paper"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleTogglePublished(paper)}
                          className={`${
                            paper.published ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'
                          }`}
                          title={paper.published ? 'Unpublish' : 'Publish'}
                        >
                          {paper.published ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(paper.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete paper"
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
      </div>
    </div>
  );
}