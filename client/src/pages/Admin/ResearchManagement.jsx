import { useState, useEffect } from 'react';
import { adminAPI } from '../../lib/api.js';

const ResearchManagement = () => {
  const [researchList, setResearchList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingResearch, setEditingResearch] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    link: '',
    is_featured: false,
    display_order: 0,
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchResearch();
  }, []);

  const fetchResearch = async () => {
    try {
      const response = await adminAPI.getResearch();
      setResearchList(response.data.data);
    } catch (error) {
      console.error('Error fetching research:', error);
      alert('Failed to fetch research projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (imageFile) data.append('image', imageFile);

    try {
      if (editingResearch) {
        await adminAPI.updateResearch(editingResearch.id, data);
        alert('Research updated successfully!');
      } else {
        await adminAPI.createResearch(data);
        alert('Research created successfully!');
      }
      fetchResearch();
      closeModal();
    } catch (error) {
      console.error('Error saving research:', error);
      alert('Failed to save research: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this research item?')) return;

    try {
      await adminAPI.deleteResearch(id);
      alert('Research deleted successfully!');
      fetchResearch();
    } catch (error) {
      console.error('Error deleting research:', error);
      alert('Failed to delete research');
    }
  };

  const openModal = (research = null) => {
    if (research) {
      setEditingResearch(research);
      setFormData({
        title: research.title || '',
        category: research.category || '',
        description: research.description || '',
        link: research.link || '',
        is_featured: research.is_featured || false,
        display_order: research.display_order || 0,
      });
    } else {
      setEditingResearch(null);
      setFormData({
        title: '',
        category: '',
        description: '',
        link: '',
        is_featured: false,
        display_order: 0,
      });
    }
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingResearch(null);
    setFormData({
      title: '',
      category: '',
      description: '',
      link: '',
      is_featured: false,
      display_order: 0,
    });
    setImageFile(null);
  };

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lnmiit-red"></div>
      </div>
    );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Research Projects</h1>
        <button onClick={() => openModal()} className="btn-primary">Add Research</button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Featured</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {researchList.map((r) => (
              <tr key={r.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.title}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{r.category}</td>
                <td className="px-6 py-4 text-sm">
                  {r.is_featured ? (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Yes</span>
                  ) : (
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">No</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button onClick={() => openModal(r)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{editingResearch ? 'Edit Research' : 'Add Research'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={4} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Link (optional)</label>
                <input type="url" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="input-field" />
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({...formData, is_featured: e.target.checked})} />
                <label className="text-sm font-medium">Featured Research</label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Display Order</label>
                <input type="number" value={formData.display_order} onChange={(e) => setFormData({...formData, display_order: e.target.value})} className="input-field" />
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

export default ResearchManagement;
