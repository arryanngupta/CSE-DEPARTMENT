import { useState, useEffect } from 'react';
import { adminAPI } from '../../lib/api.js';

const AchievementsManagement = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'student', // ✅ NEW
    students: '',
    description: '',
    link: '',
    isPublished: true,
  });

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await adminAPI.getAchievements();
      setAchievements(response.data.data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      alert('Failed to fetch achievements');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // ✅ FIX: append everything except undefined / null
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        data.append(key, value);
      }
    });

    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      if (editingAchievement) {
        await adminAPI.updateAchievement(editingAchievement.id, data);
        alert('Achievement updated successfully!');
      } else {
        await adminAPI.createAchievement(data);
        alert('Achievement created successfully!');
      }
      fetchAchievements();
      closeModal();
    } catch (error) {
      console.error('Error saving achievement:', error);
      alert(
        'Failed to save achievement: ' +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const openModal = (achievement = null) => {
    if (achievement) {
      setEditingAchievement(achievement);
      setFormData({
        title: achievement.title,
        category: achievement.category || 'student',
        students: achievement.students || '',
        description: achievement.description || '',
        link: achievement.link || '',
        isPublished: achievement.isPublished,
      });
    } else {
      setEditingAchievement(null);
      setFormData({
        title: '',
        category: 'student',
        students: '',
        description: '',
        link: '',
        isPublished: true,
      });
    }
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAchievement(null);
    setFormData({
      title: '',
      category: 'student',
      students: '',
      description: '',
      link: '',
      isPublished: true,
    });
    setImageFile(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lnmiit-red"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Achievements
        </h1>
        <button onClick={() => openModal()} className="btn-primary">
          Add Achievement
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {achievements.map((a) => (
              <tr key={a.id}>
                <td className="px-6 py-4">{a.title}</td>
                <td className="px-6 py-4 capitalize">{a.category}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      a.isPublished
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {a.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => openModal(a)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
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

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4">
              {editingAchievement ? 'Edit' : 'Add'} Achievement
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="input-field"
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />

              <select
                className="input-field"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>

              <textarea
                className="input-field"
                placeholder="Students / Faculty Names"
                value={formData.students}
                onChange={(e) =>
                  setFormData({ ...formData, students: e.target.value })
                }
              />

              <textarea
                className="input-field"
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <input
                className="input-field"
                placeholder="Link"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isPublished: e.target.checked,
                    })
                  }
                />
                Published
              </label>

              <div className="flex gap-4">
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

export default AchievementsManagement;
  