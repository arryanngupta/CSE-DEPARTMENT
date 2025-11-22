// frontend/src/pages/Admin/ProgramsManagement.jsx
import { useState, useEffect } from "react";
import { adminAPI } from "../../lib/api.js";
import { Plus, Edit, Trash2, Save, X, Sliders } from "lucide-react";
import SectionsManager from "../../components/admin/SectionsManager.jsx";

const ProgramsManagement = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeSectionsProgram, setActiveSectionsProgram] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    short_name: "",
    level: "UG",
    description: "",
    overview: "",
    duration: "",
    total_credits: "",
    display_order: 0,
    curriculum: null,
  });

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await adminAPI.getPrograms();
      setPrograms(response.data.data);
    } catch (error) {
      console.error("Error fetching programs:", error);
      alert("Failed to fetch programs");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "") {
        data.append(key, formData[key]);
      }
    });

    try {
      if (editingId) {
        await adminAPI.updateProgram(editingId, data);
        alert("Program updated successfully");
      } else {
        await adminAPI.createProgram(data);
        alert("Program created successfully");
      }

      resetForm();
      fetchPrograms();
    } catch (error) {
      console.error("Error saving program:", error);
      alert("Failed to save program");
    }
  };

  const handleEdit = (program) => {
    setEditingId(program.id);
    setFormData({
      name: program.name,
      short_name: program.short_name || "",
      level: program.level,
      description: program.description || "",
      overview: program.overview || "",
      duration: program.duration || "",
      total_credits: program.total_credits || "",
      display_order: program.display_order || 0,
      curriculum: null,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this program?")) return;

    try {
      await adminAPI.deleteProgram(id);
      alert("Program deleted successfully");
      fetchPrograms();
    } catch (error) {
      console.error("Error deleting program:", error);
      alert("Failed to delete program");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      short_name: "",
      level: "UG",
      description: "",
      overview: "",
      duration: "",
      total_credits: "",
      display_order: 0,
      curriculum: null,
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Programs Management</h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? "Cancel" : "Add Program"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>

            {/* Short Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Name
              </label>
              <input
                type="text"
                value={formData.short_name}
                onChange={(e) =>
                  setFormData({ ...formData, short_name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="e.g. B.Tech CSE"
              />
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level *
              </label>
              <select
                value={formData.level}
                onChange={(e) =>
                  setFormData({ ...formData, level: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="UG">Undergraduate (UG)</option>
                <option value="PG">Postgraduate (PG)</option>
                <option value="PhD">Doctoral (PhD)</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="e.g. 4 Years"
              />
            </div>

            {/* Credits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Credits
              </label>
              <input
                type="number"
                value={formData.total_credits}
                onChange={(e) =>
                  setFormData({ ...formData, total_credits: e.target.value })
                }
                className="w-full px-3 py-2 border"
              />
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    display_order: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            {/* Overview */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overview
              </label>
              <textarea
                rows={4}
                value={formData.overview}
                onChange={(e) =>
                  setFormData({ ...formData, overview: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            {/* Curriculum PDF */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Curriculum PDF
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    curriculum: e.target.files[0],
                  })
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded"
            >
              <Save size={18} /> {editingId ? "Update" : "Create"} Program
            </button>

            <button
              onClick={resetForm}
              className="flex items-center gap-2 bg-gray-500 text-white px-6 py-2 rounded"
            >
              <X size={18} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Program List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs text-gray-500">
                Program
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-500">
                Level
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-500">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-500">
                Credits
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-500">
                Sections
              </th>
              <th className="px-6 py-3 text-right text-xs text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {programs.map((program) => (
              <tr key={program.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{program.name}</div>
                  {program.short_name && (
                    <div className="text-sm text-gray-500">
                      {program.short_name}
                    </div>
                  )}
                </td>

                <td className="px-6 py-4 text-sm text-gray-900">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    {program.level}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-gray-900">
                  {program.duration || "-"}
                </td>

                <td className="px-6 py-4 text-sm text-gray-900">
                  {program.total_credits || "-"}
                </td>

                <td className="px-6 py-4 text-sm text-gray-900">
                  {program.sections?.length ?? 0}
                </td>

                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setActiveSectionsProgram(program.id);
                    }}
                    className="text-gray-700 hover:text-gray-900 mr-3"
                  >
                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">
                      <Sliders size={16} /> Manage Sections
                    </span>
                  </button>

                  <button
                    onClick={() => handleEdit(program)}
                    className="text-blue-600 hover:text-blue-900 mr-2"
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(program.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Use "Manage Sections" to add curriculum,
          outcomes, and section content.
        </p>
      </div>

      {activeSectionsProgram && (
        <SectionsManager
          programId={activeSectionsProgram}
          onClose={() => {
            setActiveSectionsProgram(null);
            fetchPrograms();
          }}
        />
      )}
    </div>
  );
};

export default ProgramsManagement;
