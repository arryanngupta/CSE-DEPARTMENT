import { useState, useEffect } from "react";
import { adminAPI } from "../../lib/api.js";

const EMPTY_FORM = {
  title: "",
  category: "",
  description: "",
  link: "",
  is_featured: false,
  display_order: 0,

  // Publication
  authors: "",
  journal: "",
  year: "",

  // Project
  faculty: "",
  funding_agency: "",
  status: "",

  // Patent
  inventors: "",
  application_no: "",
  patent_status: "",

  // Collaboration
  collaboration_org: "",
};

export default function ResearchManagement() {
  const [researchList, setResearchList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingResearch, setEditingResearch] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchResearch();
  }, []);

  const fetchResearch = async () => {
    try {
      const res = await adminAPI.getResearch();
      setResearchList(res.data.data || []);
    } catch (err) {
      alert("Failed to load research");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingResearch(item);
      setFormData({ ...EMPTY_FORM, ...item });
    } else {
      setEditingResearch(null);
      setFormData(EMPTY_FORM);
    }
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingResearch(null);
    setFormData(EMPTY_FORM);
    setImageFile(null);
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(formData).forEach(([k, v]) => {
      if (v !== null && v !== "") data.append(k, v);
    });

    if (imageFile) data.append("image", imageFile);

    try {
      if (editingResearch) {
        await adminAPI.updateResearch(editingResearch.id, data);
        alert("Research updated");
      } else {
        await adminAPI.createResearch(data);
        alert("Research created");
      }
      fetchResearch();
      closeModal();
    } catch (err) {
      alert("Failed to save research");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this research item?")) return;
    await adminAPI.deleteResearch(id);
    fetchResearch();
  };

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-700" />
      </div>
    );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Research</h1>
        <button className="btn-primary" onClick={() => openModal()}>
          Add Research
        </button>
      </div>

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3">Featured</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {researchList.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-3">{r.title}</td>
              <td className="p-3">{r.category}</td>
              <td className="p-3 text-center">
                {r.is_featured ? "Yes" : "No"}
              </td>
              <td className="p-3 space-x-3">
                <button onClick={() => openModal(r)} className="text-blue-600">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-6">
              {editingResearch ? "Edit Research" : "Add Research"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Title *"
                value={formData.title}
                onChange={(v) => handleChange("title", v)}
                required
              />

              <Select
                label="Category *"
                value={formData.category}
                onChange={(v) => handleChange("category", v)}
                options={["Publication", "Project", "Patent", "Collaboration"]}
                required
              />

              {/* ===== Publication ===== */}
              {formData.category === "Publication" && (
                <>
                  <Input
                    label="Authors"
                    value={formData.authors}
                    onChange={(v) => handleChange("authors", v)}
                  />
                  <Input
                    label="Journal / Conference"
                    value={formData.journal}
                    onChange={(v) => handleChange("journal", v)}
                  />
                  <Input
                    label="Year"
                    value={formData.year}
                    onChange={(v) => handleChange("year", v)}
                  />
                </>
              )}

              {/* ===== Project ===== */}
              {formData.category === "Project" && (
                <>
                  <Input
                    label="Principal Investigator"
                    value={formData.faculty}
                    onChange={(v) => handleChange("faculty", v)}
                  />
                  <Input
                    label="Funding Agency"
                    value={formData.funding_agency}
                    onChange={(v) => handleChange("funding_agency", v)}
                  />
                  <Input
                    label="Status"
                    value={formData.status}
                    onChange={(v) => handleChange("status", v)}
                  />
                  <Textarea
                    label="Description"
                    value={formData.description}
                    onChange={(v) => handleChange("description", v)}
                  />
                </>
              )}

              {/* ===== Patent ===== */}
              {formData.category === "Patent" && (
                <>
                  <Input
                    label="Inventors"
                    value={formData.inventors}
                    onChange={(v) => handleChange("inventors", v)}
                  />
                  <Input
                    label="Application No."
                    value={formData.application_no}
                    onChange={(v) => handleChange("application_no", v)}
                  />
                  <Input
                    label="Patent Status"
                    value={formData.patent_status}
                    onChange={(v) => handleChange("patent_status", v)}
                  />
                </>
              )}

              {/* ===== Collaboration ===== */}
              {formData.category === "Collaboration" && (
                <Input
                  label="Organization Name"
                  value={formData.collaboration_org}
                  onChange={(v) => handleChange("collaboration_org", v)}
                />
              )}

              <Input
                label="Link (optional)"
                value={formData.link}
                onChange={(v) => handleChange("link", v)}
              />

              <input
                type="file"
                onChange={(e) => setImageFile(e.target.files[0])}
              />

              <label className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) =>
                    handleChange("is_featured", e.target.checked)
                  }
                />
                Featured Research
              </label>

              <Input
                label="Display Order"
                type="number"
                value={formData.display_order}
                onChange={(v) => handleChange("display_order", v)}
              />

              <div className="flex gap-4 pt-4">
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
}

/* ===== Small helpers ===== */
const Input = ({ label, value, onChange, type = "text", required }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      value={value || ""}
      required={required}
      onChange={(e) => onChange(e.target.value)}
      className="input-field"
    />
  </div>
);

const Textarea = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <textarea
      rows={4}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="input-field"
    />
  </div>
);

const Select = ({ label, value, onChange, options, required }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select
      value={value}
      required={required}
      onChange={(e) => onChange(e.target.value)}
      className="input-field"
    >
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);
