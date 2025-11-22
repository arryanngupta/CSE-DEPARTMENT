import { useState, useEffect } from 'react';
import { adminAPI } from '../../lib/api.js';

const SliderManagement = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlider, setEditingSlider] = useState(null);
  const [formData, setFormData] = useState({
    caption: '',
    order: 0,
    isActive: true
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const response = await adminAPI.getSliders();
      setSliders(response.data.data);
    } catch (error) {
      console.error('Error fetching sliders:', error);
      alert('Failed to fetch sliders');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('caption', formData.caption);
    data.append('order', formData.order);
    data.append('isActive', formData.isActive);
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      if (editingSlider) {
        await adminAPI.updateSlider(editingSlider.id, data);
        alert('Slider updated successfully!');
      } else {
        await adminAPI.createSlider(data);
        alert('Slider created successfully!');
      }
      fetchSliders();
      closeModal();
    } catch (error) {
      console.error('Error saving slider:', error);
      alert('Failed to save slider: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this slider?')) return;

    try {
      await adminAPI.deleteSlider(id);
      alert('Slider deleted successfully!');
      fetchSliders();
    } catch (error) {
      console.error('Error deleting slider:', error);
      alert('Failed to delete slider');
    }
  };

  const openModal = (slider = null) => {
    if (slider) {
      setEditingSlider(slider);
      setFormData({
        caption: slider.caption || '',
        order: slider.order,
        isActive: slider.isActive
      });
    } else {
      setEditingSlider(null);
      setFormData({
        caption: '',
        order: 0,
        isActive: true
      });
    }
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSlider(null);
    setFormData({
      caption: '',
      order: 0,
      isActive: true
    });
    setImageFile(null);
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lnmiit-red"></div></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Hero Sliders</h1>
        <button onClick={() => openModal()} className="btn-primary">
          Add New Slider
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Caption</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sliders.map((slider) => (
              <tr key={slider.id}>
                <td className="px-6 py-4">
                  <img src={slider.image_path} alt={slider.caption} className="h-16 w-24 object-cover rounded" />
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{slider.caption}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{slider.order}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${slider.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {slider.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button onClick={() => openModal(slider)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(slider.id)} className="text-red-600 hover:underline">Delete</button>
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
            <h2 className="text-2xl font-bold mb-4">{editingSlider ? 'Edit Slider' : 'Add New Slider'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image {!editingSlider && '*'}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  required={!editingSlider}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                <input
                  type="text"
                  value={formData.caption}
                  onChange={(e) => setFormData({...formData, caption: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: e.target.value})}
                  className="input-field"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">Active</label>
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

export default SliderManagement;