import { useState, useEffect } from 'react';
import { adminAPI } from '../../lib/api.js';

const PeopleManagement = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);

  const emptyForm = {
    name: "",
    designation: "",
    email: "",
    phone: "",
    department: "Computer Science & Engineering",
    webpage: "",
    research_areas: "",
    joining_date: "",
    bio: "",
    education: "",
    publications: "",
    workshops: "",
    order: 0
  };

  const [formData, setFormData] = useState(emptyForm);
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      const response = await adminAPI.getPeople();
      setPeople(response.data.data);
    } catch (error) {
      alert("Failed to fetch faculty members");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (photoFile) data.append("photo", photoFile);

    try {
      if (editingPerson) {
        await adminAPI.updatePerson(editingPerson.id, data);
        alert("Faculty member updated successfully!");
      } else {
        await adminAPI.createPerson(data);
        alert("Faculty member created successfully!");
      }

      fetchPeople();
      closeModal();
    } catch (error) {
      alert("Failed to save faculty member");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;

    try {
      await adminAPI.deletePerson(id);
      alert("Deleted successfully");
      fetchPeople();
    } catch {
      alert("Failed to delete");
    }
  };

  const openModal = (person = null) => {
    if (person) {
      setEditingPerson(person);

      setFormData({
        name: person.name,
        designation: person.designation,
        email: person.email || "",
        phone: person.phone || "",
        department: person.department || "Computer Science & Engineering",
        webpage: person.webpage || "",
        research_areas: person.research_areas || "",
        joining_date: person.joining_date ? person.joining_date.split("T")[0] : "",
        bio: person.bio || "",
        education: person.education ? JSON.stringify(person.education, null, 2) : "",
        publications: person.publications ? JSON.stringify(person.publications, null, 2) : "",
        workshops: person.workshops ? JSON.stringify(person.workshops, null, 2) : "",
        order: person.order ?? 0
      });

    } else {
      setEditingPerson(null);
      setFormData(emptyForm);
    }

    setPhotoFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPerson(null);
    setFormData(emptyForm);
    setPhotoFile(null);
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
        <h1 className="text-3xl font-bold">Faculty Members</h1>
        <button onClick={() => openModal()} className="btn-primary">Add Faculty Member</button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium">Photo</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Designation</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {people.map((person) => (
              <tr key={person.id}>
                <td className="px-6 py-4">
                  {person.photo_path ? (
                    <img src={person.photo_path} className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                  )}
                </td>
                <td className="px-6 py-4">{person.name}</td>
                <td className="px-6 py-4">{person.designation}</td>
                <td className="px-6 py-4">{person.email}</td>
                <td className="px-6 py-4 space-x-2">
                  <button onClick={() => openModal(person)} className="text-blue-600">Edit</button>
                  <button onClick={() => handleDelete(person.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            
            <h2 className="text-2xl font-bold mb-4">
              {editingPerson ? "Edit Faculty Member" : "Add Faculty Member"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <Input label="Name *" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} />
              <Input label="Designation *" value={formData.designation} onChange={(v) => setFormData({...formData, designation: v})} />

              <Input label="Email" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
              <Input label="Phone" value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />

              <div>
                <label className="block mb-2">Department</label>
                <select
                  className="input-field"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                >
                  <option>Computer Science & Engineering</option>
                  <option>Electronics & Communications Engineering</option>
                  <option>Mechanical Engineering</option>
                  <option>Mathematics</option>
                  <option>Physics</option>
                </select>
              </div>

              <Input label="Webpage URL" value={formData.webpage} onChange={(v) => setFormData({...formData, webpage: v})} />

              <Textarea label="Research Areas" value={formData.research_areas} onChange={(v) => setFormData({...formData, research_areas: v})} />

              <Input type="date" label="Date of Joining" value={formData.joining_date} onChange={(v) => setFormData({...formData, joining_date: v})} />

              <Textarea label="Biography" value={formData.bio} onChange={(v) => setFormData({...formData, bio: v})} />

              <Textarea label="Education (JSON)" value={formData.education} onChange={(v) => setFormData({...formData, education: v})} />

              <Textarea label="Publications (JSON)" value={formData.publications} onChange={(v) => setFormData({...formData, publications: v})} />

              <Textarea label="Workshops (JSON)" value={formData.workshops} onChange={(v) => setFormData({...formData, workshops: v})} />

              <Input type="file" label="Photo" onFile={(f) => setPhotoFile(f)} />

              <Input type="number" label="Order" value={formData.order} onChange={(v) => setFormData({...formData, order: v})} />

              <div className="flex space-x-4 pt-4">
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

export default PeopleManagement;

const Input = ({ label, value, onChange, type = "text", onFile }) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    {type === "file" ? (
      <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files[0])} className="input-field" />
    ) : (
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="input-field" />
    )}
  </div>
);

const Textarea = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="input-field"></textarea>
  </div>
);
