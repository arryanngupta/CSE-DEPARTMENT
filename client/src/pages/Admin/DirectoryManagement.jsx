import { useState, useEffect } from 'react';
import { adminAPI } from '../../lib/api.js';

const DirectoryManagement = () => {
  const [directory, setDirectory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    phone: '',
    email: '',
    location: ''
  });

  useEffect(() => {
    fetchDirectory();
  }, []);

  const fetchDirectory = async () => {
    try {
      const response = await adminAPI.getDirectory();
      setDirectory(response.data.data);
    } catch (error) {
      console.error('Error fetching directory:', error);
      alert('Failed to fetch directory');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingEntry) {
        await adminAPI.updateDirectoryEntry(editingEntry.id, formData);
        alert('Directory entry updated successfully!');
      } else {
        await adminAPI.createDirectoryEntry(formData);
        alert('Directory entry created successfully!');
      }
      fetchDirectory();
      closeModal();
    } catch (error) {
      console.error('Error saving directory entry:', error);
      alert('Failed to save directory entry: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this directory entry?')) return;

    try {
      await adminAPI.deleteDirectoryEntry(id);
      alert('Directory entry deleted successfully!');
      fetchDirectory();
    } catch (error) {
      console.error('Error deleting directory entry:', error);
      alert('Failed to delete directory entry');
    }
  };

  const openModal = (entry = null) => {
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        name: entry.name,
        role: entry.role,
        phone: entry.phone || '',
        email: entry.email || '',
        location: entry.location || ''
      });
    } else {
      setEditingEntry(null);
      setFormData({
        name: '',
        role: '',
        phone: '',
        email: '',
        location: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEntry(null);
    setFormData({
      name: '',
      role: '',
      phone: '',
      email: '',
      location: ''
    });
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lnmiit-red"></div></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Department Directory</h1>
        <button onClick={() => openModal()} className="btn-primary">
          Add Entry
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {directory.map((entry) => (
              <tr key={entry.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{entry.name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{entry.role}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{entry.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{entry.email}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{entry.location}</td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button onClick={() => openModal(entry)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(entry.id)} className="text-red-600 hover:underline">Delete</button>
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
            <h2 className="text-2xl font-bold mb-4">{editingEntry ? 'Edit Directory Entry' : 'Add Directory Entry'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="input-field"
                  placeholder="Block A, Room 301"
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

export default DirectoryManagement;