import { useState, useEffect } from "react";
import { adminAPI } from "../../lib/api.js";

const PeopleManagement = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);

  const emptyForm = {
    name: "",
    person_type: "Faculty",
    designation: "",
    email: "",
    phone: "",
    department: "Computer Science & Engineering",
    webpage: "",
    summary: "",
    research_areas: "",
    joining_date: "",
    bio: "",
    order: 0,
    profile_sections: []
  };

  const [formData, setFormData] = useState(emptyForm);
  const [photoFile, setPhotoFile] = useState(null);
  const [jsonText, setJsonText] = useState("[]");
  const [jsonError, setJsonError] = useState("");

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      const res = await adminAPI.getPeople();
      setPeople(res.data.data);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to fetch people");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (jsonError) {
      alert("Fix JSON error first");
      return;
    }

    const data = new FormData();

    const profileSections = Array.isArray(formData.profile_sections)
      ? formData.profile_sections
      : [];

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "profile_sections") {
        data.append(key, JSON.stringify(profileSections));
      } else {
        data.append(key, value ?? "");
      }
    });

    if (photoFile) data.append("photo", photoFile);

    try {
      if (editingPerson) {
        await adminAPI.updatePerson(editingPerson.id, data);
        alert("Person updated successfully");
      } else {
        await adminAPI.createPerson(data);
        alert("Person created successfully");
      }

      await fetchPeople();
      closeModal();
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save person");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;

    try {
      await adminAPI.deletePerson(id);
      await fetchPeople();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
    }
  };

  const openModal = (person = null) => {
    if (person) {
      setEditingPerson(person);

      let sections = [];

      if (person.profile_sections) {
        if (typeof person.profile_sections === "string") {
          try {
            sections = JSON.parse(person.profile_sections);
          } catch {
            sections = [];
          }
        } else if (Array.isArray(person.profile_sections)) {
          sections = person.profile_sections;
        }
      }

      setFormData({
        ...emptyForm,
        ...person,
        joining_date: person.joining_date?.split("T")[0] || "",
        profile_sections: sections
      });

      setJsonText(JSON.stringify(sections, null, 2));
    } else {
      setEditingPerson(null);
      setFormData(emptyForm);
      setJsonText("[]");
    }

    setPhotoFile(null);
    setJsonError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPerson(null);
    setFormData(emptyForm);
    setPhotoFile(null);
    setJsonText("[]");
    setJsonError("");
  };

  const handleJsonChange = (value) => {
    setJsonText(value);

    try {
      const parsed = JSON.parse(value);
      setFormData({ ...formData, profile_sections: parsed });
      setJsonError("");
    } catch (e) {
      setJsonError("Invalid JSON");
    }
  };

  const getSectionsCount = (person) => {
    if (!person.profile_sections) return 0;

    if (typeof person.profile_sections === "string") {
      try {
        const parsed = JSON.parse(person.profile_sections);
        return parsed.length || 0;
      } catch {
        return 0;
      }
    }

    if (Array.isArray(person.profile_sections)) {
      return person.profile_sections.length;
    }

    return 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-lnmiit-red" />
      </div>
    );
  }

  return (
    <div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">People Management</h1>

        <button onClick={() => openModal()} className="btn-primary">
          Add Person
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">

          <thead className="bg-gray-50">
            <tr>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Photo
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Person Type
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Designation
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Sections
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>

            </tr>
          </thead>

          <tbody className="divide-y">

            {people.map((person) => {

              const sectionsCount = getSectionsCount(person);

              return (
                <tr key={person.id}>

                  <td className="px-6 py-4">
                    {person.photo_path ? (
                      <img
                        src={person.photo_path}
                        alt={person.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xs">No Photo</span>
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4">{person.name}</td>

                  <td className="px-6 py-4">{person.person_type}</td>

                  <td className="px-6 py-4">{person.designation}</td>

                  <td className="px-6 py-4">{person.email}</td>

                  <td className="px-6 py-4">
                    {sectionsCount > 0
                      ? `${sectionsCount} sections`
                      : "No sections"}
                  </td>

                  <td className="px-6 py-4 space-x-2">

                    <button
                      onClick={() => openModal(person)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(person.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              );
            })}

          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">

          <div className="bg-white rounded-lg w-full max-w-2xl p-6">

            <h2 className="text-xl font-bold mb-4">
              {editingPerson ? "Edit Person" : "Add Person"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <Input
                label="Name"
                value={formData.name}
                onChange={(v) => setFormData({ ...formData, name: v })}
                required
              />

              <div>
                <label className="block text-sm font-medium mb-1">
                  Person Type
                </label>

                <select
                  value={formData.person_type}
                  onChange={(e) =>
                    setFormData({ ...formData, person_type: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="Faculty">Faculty</option>
                  <option value="Staff">Staff</option>
                  <option value="Research Scholar">Research Scholar</option>
                  <option value="Alumni">Prominent Alumni</option>
                </select>
              </div>

              <Input
                label="Designation"
                value={formData.designation}
                onChange={(v) =>
                  setFormData({ ...formData, designation: v })
                }
              />

              <Input
                label="Email"
                value={formData.email}
                onChange={(v) =>
                  setFormData({ ...formData, email: v })
                }
              />

              <Input
                label="Phone"
                value={formData.phone}
                onChange={(v) =>
                  setFormData({ ...formData, phone: v })
                }
              />

              <Input
                type="file"
                label="Photo"
                onFile={setPhotoFile}
              />

              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                {editingPerson ? "Update" : "Create"}
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default PeopleManagement;

const Input = ({ label, value, onChange, type = "text", onFile, required }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>

    {type === "file" ? (
      <input
        type="file"
        onChange={(e) => onFile(e.target.files?.[0] || null)}
      />
    ) : (
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-3 py-2"
        required={required}
      />
    )}
  </div>
);