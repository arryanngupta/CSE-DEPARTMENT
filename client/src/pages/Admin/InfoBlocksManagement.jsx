import { useState, useEffect } from 'react';
import { adminAPI } from '../../lib/api.js';

const InfoBlocksManagement = () => {
  const [infoBlocks, setInfoBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [formData, setFormData] = useState({
    key: '',
    title: '',
    body: ''
  });
  const [mediaFile, setMediaFile] = useState(null);

  useEffect(() => {
    fetchInfoBlocks();
  }, []);

  const fetchInfoBlocks = async () => {
    try {
      const response = await adminAPI.getInfoBlocks();
      setInfoBlocks(response.data.data);
    } catch (error) {
      console.error('Error fetching info blocks:', error);
      alert('Failed to fetch info blocks');
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
    if (mediaFile) {
      data.append('media', mediaFile);
    }

    try {
      if (editingBlock) {
        await adminAPI.updateInfoBlock(editingBlock.id, data);
        alert('Info block updated successfully!');
      } else {
        await adminAPI.createInfoBlock(data);
        alert('Info block created successfully!');
      }
      fetchInfoBlocks();
      closeModal();
    } catch (error) {
      console.error('Error saving info block:', error);
      alert('Failed to save info block: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this info block?')) return;

    try {
      await adminAPI.deleteInfoBlock(id);
      alert('Info block deleted successfully!');
      fetchInfoBlocks();
    } catch (error) {
      console.error('Error deleting info block:', error);
      alert('Failed to delete info block');
    }
  };

  const openModal = (block = null) => {
    if (block) {
      setEditingBlock(block);
      setFormData({
        key: block.key,
        title: block.title,
        body: block.body || ''
      });
    } else {
      setEditingBlock(null);
      setFormData({
        key: '',
        title: '',
        body: ''
      });
    }
    setMediaFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBlock(null);
    setFormData({
      key: '',
      title: '',
      body: ''
    });
    setMediaFile(null);
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lnmiit-red"></div></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Info Blocks</h1>
        <button onClick={() => openModal()} className="btn-primary">
          Add Info Block
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Key</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Media</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {infoBlocks.map((block) => (
              <tr key={block.id}>
                <td className="px-6 py-4 text-sm font-mono text-gray-900">{block.key}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{block.title}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {block.media_path ? (
                    <a href={block.media_path} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      View
                    </a>
                  ) : (
                    'No media'
                  )}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button onClick={() => openModal(block)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(block.id)} className="text-red-600 hover:underline">Delete</button>
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
            <h2 className="text-2xl font-bold mb-4">{editingBlock ? 'Edit Info Block' : 'Add Info Block'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Key * (e.g., about_department)</label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData({...formData, key: e.target.value})}
                  required
                  disabled={editingBlock !== null}
                  className="input-field"
                  placeholder="about_department"
                />
              </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Body</label>
                <textarea
                  value={formData.body}
                  onChange={(e) => setFormData({...formData, body: e.target.value})}
                  rows={8}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Media (Image or PDF)</label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setMediaFile(e.target.files[0])}
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

export default InfoBlocksManagement;