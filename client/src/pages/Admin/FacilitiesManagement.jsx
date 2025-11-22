import { useState, useEffect } from 'react';
import { adminAPI } from '../../lib/api.js';

const FacilitiesManagement = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    specifications: '',
    location: '',
    capacity: '',
    in_charge: '',
    is_active: true,
    display_order: 0,
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const response = await adminAPI.getFacilities();
      setFacilities(response.data.data);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      alert('Failed to fetch facilities');
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
      if (editingFacility) {
        await adminAPI.updateFacility(editingFacility.id, data);
        alert('Facility updated successfully!');
      } else {
        await adminAPI.createFacility(data);
        alert('Facility created successfully!');
      }
      fetchFacilities();
      closeModal();
    } catch (error) {
      console.error('Error saving facility:', error);
      alert('Failed to save facility: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this facility?')) return;

    try {
      await adminAPI.deleteFacility(id);
      alert('Facility deleted successfully!');
      fetchFacilities();
    } catch (error) {
      console.error('Error deleting facility:', error);
      alert('Failed to delete facility');
    }
  };

  const openModal = (facility = null) => {
    if (facility) {
      setEditingFacility(facility);
      setFormData({
        name: facility.name || '',
        category: facility.category || '',
        description: facility.description || '',
        specifications: facility.specifications || '',
        location: facility.location || '',
        capacity: facility.capacity || '',
        in_charge: facility.in_charge || '',
        is_active: facility.is_active || true,
        display_order: facility.display_order || 0,
      });
    } else {
      setEditingFacility(null);
      setFormData({
        name: '',
        category: '',
        description: '',
        specifications: '',
        location: '',
        capacity: '',
        in_charge: '',
        is_active: true,
        display_order: 0,
      });
    }
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingFacility(null);
    setFormData({
      name: '',
      category: '',
      description: '',
      specifications: '',
      location: '',
      capacity: '',
      in_charge: '',
      is_active: true,
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
        <h1 className="text-3xl font-bold text-gray-900">Facilities</h1>
        <button onClick={() => openModal()} className="btn-primary">
          Add Facility
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Active</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {facilities.map((facility) => (
              <tr key={facility.id}>
                <td className="px-6 py-4">
                  {facility.image_path ? (
                    <img
                      src={facility.image_path}
                      alt={facility.name}
                      className="h-12 w-12 rounded object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gray-200 rounded"></div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{facility.name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{facility.category}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      facility.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {facility.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => openModal(facility)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(facility.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
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
            <h2 className="text-2xl font-bold mb-4">
              {editingFacility ? 'Edit Facility' : 'Add Facility'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="input-field"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Specifications</label>
                <textarea
                  rows={2}
                  value={formData.specifications}
                  onChange={(e) =>
                    setFormData({ ...formData, specifications: e.target.value })
                  }
                  className="input-field"
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Capacity</label>
                  <input
                    type="text"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">In-Charge</label>
                <input
                  type="text"
                  value={formData.in_charge}
                  onChange={(e) =>
                    setFormData({ ...formData, in_charge: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="input-field"
                />
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                />
                <label className="text-sm font-medium">Active</label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      display_order: parseInt(e.target.value),
                    })
                  }
                  className="input-field"
                />
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="btn-primary flex-1">
                  Save
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilitiesManagement;
