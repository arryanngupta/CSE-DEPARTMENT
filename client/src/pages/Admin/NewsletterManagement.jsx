import { useState, useEffect } from 'react';
import { adminAPI } from '../../lib/api.js';

const NewsletterManagement = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNewsletter, setEditingNewsletter] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    issueDate: '',
    description: ''
  });
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    try {
      const response = await adminAPI.getNewsletters();
      setNewsletters(response.data.data);
    } catch (error) {
      console.error('Error fetching newsletters:', error);
      alert('Failed to fetch newsletters');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    if (pdfFile) {
      data.append('pdf', pdfFile);
    }

    try {
      if (editingNewsletter) {
        await adminAPI.updateNewsletter(editingNewsletter.id, data);
        alert('Newsletter updated successfully!');
      } else {
        await adminAPI.createNewsletter(data);
        alert('Newsletter created successfully!');
      }
      fetchNewsletters();
      closeModal();
    } catch (error) {
      console.error('Error saving newsletter:', error);
      alert('Failed to save newsletter: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this newsletter?')) return;

    try {
      await adminAPI.deleteNewsletter(id);
      alert('Newsletter deleted successfully!');
      fetchNewsletters();
    } catch (error) {
      console.error('Error deleting newsletter:', error);
      alert('Failed to delete newsletter');
    }
  };

  const openModal = (newsletter = null) => {
    if (newsletter) {
      setEditingNewsletter(newsletter);
      setFormData({
        title: newsletter.title,
        issueDate: newsletter.issueDate.split('T')[0],
        description: newsletter.description || ''
      });
    } else {
      setEditingNewsletter(null);
      setFormData({
        title: '',
        issueDate: '',
        description: ''
      });
    }
    setPdfFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingNewsletter(null);
    setFormData({
      title: '',
      issueDate: '',
      description: ''
    });
    setPdfFile(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lnmiit-red"></div></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Newsletters</h1>
        <button onClick={() => openModal()} className="btn-primary">
          Add Newsletter
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PDF</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {newsletters.map((newsletter) => (
              <tr key={newsletter.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{newsletter.title}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{formatDate(newsletter.issueDate)}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <a href={newsletter.pdf_path} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    View PDF
                  </a>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button onClick={() => openModal(newsletter)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(newsletter.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{editingNewsletter ? 'Edit Newsletter' : 'Add Newsletter'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date *</label>
                <input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PDF File {!editingNewsletter && '*'}</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPdfFile(e.target.files[0])}
                  required={!editingNewsletter}
                  className="input-field"
                />
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="btn-primary flex-1">Save</button>
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterManagement;