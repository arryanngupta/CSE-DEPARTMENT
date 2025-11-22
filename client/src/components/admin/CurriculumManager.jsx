// frontend/src/components/admin/CurriculumManager.jsx
import { useEffect, useState } from "react";
import SimpleModal from "./SimpleModal.jsx";
import { adminAPI } from "../../lib/api.js";

const CurriculumManager = ({ section, onClose }) => {
  const [open, setOpen] = useState(true);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);

  // new semester form
  const [semForm, setSemForm] = useState({
    semester_number: 1,
    semester_name: "",
    display_order: 0,
  });

  // course form state
  const [courseForm, setCourseForm] = useState({
    semester_id: null,
    course_name: "",
    course_type: "IC",
    theory_hours: 0,
    lab_hours: 0,
    tutorial_hours: 0,
    practical_hours: 0,
    credits: 0,
    display_order: 0,
  });
  const [editingCourseId, setEditingCourseId] = useState(null);

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [section]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getProgramSections(section.program_id);
      const sec = (res.data.data || []).find((s) => s.id === section.id);
      setSemesters(sec?.semesters || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load curriculum");
    } finally {
      setLoading(false);
    }
  };

  const addSemester = async () => {
  if (!semForm.semester_name.trim())
    return alert("Semester name required");

  try {
    await adminAPI.createSemester(section.id, {
      section_id: section.id,              // REQUIRED 🔥
      semester_number: semForm.semester_number,
      semester_name: semForm.semester_name,
      display_order: semForm.display_order,
    });

    setSemForm({ semester_number: 1, semester_name: "", display_order: 0 });
    load();
  } catch (err) {
    console.error(err);
    alert("Failed to add semester");
  }
};

  const deleteSemester = async (id) => {
    if (!confirm("Delete semester and all its courses?")) return;
    try {
      await adminAPI.deleteSemester(id);
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to delete semester");
    }
  };

  const openCourseForm = (semesterId, course = null) => {
    if (course) {
      setEditingCourseId(course.id);
      setCourseForm({ ...course, semester_id: semesterId });
    } else {
      setEditingCourseId(null);
      setCourseForm({
        semester_id: semesterId,
        course_name: "",
        course_type: "IC",
        theory_hours: 0,
        lab_hours: 0,
        tutorial_hours: 0,
        practical_hours: 0,
        credits: 0,
        display_order: 0,
      });
    }
  };

  const saveCourse = async () => {
    if (!courseForm.course_name.trim()) return alert("Course name required");

    try {
      if (editingCourseId) {
        await adminAPI.updateCourse(editingCourseId, courseForm);
      } else {
        await adminAPI.createCourse(courseForm.semester_id, courseForm);
      }
      setCourseForm({
        semester_id: null,
        course_name: "",
        course_type: "IC",
        theory_hours: 0,
        lab_hours: 0,
        tutorial_hours: 0,
        practical_hours: 0,
        credits: 0,
        display_order: 0,
      });
      setEditingCourseId(null);
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to save course");
    }
  };

  const deleteCourse = async (id) => {
    if (!confirm("Delete course?")) return;
    try {
      await adminAPI.deleteCourse(id);
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to delete course");
    }
  };

  return (
    <SimpleModal
      open={open}
      title={`Curriculum: ${section.title}`}
      onClose={() => {
        setOpen(false);
        onClose();
      }}
      size="max-w-4xl"
    >
      <div>
        {/* Add Semester */}
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Add Semester</h4>
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              value={semForm.semester_number}
              onChange={(e) =>
                setSemForm({
                  ...semForm,
                  semester_number: Number(e.target.value),
                })
              }
              className="px-3 py-2 border rounded w-24"
            />
            <input
              placeholder="Semester name"
              value={semForm.semester_name}
              onChange={(e) =>
                setSemForm({ ...semForm, semester_name: e.target.value })
              }
              className="px-3 py-2 border rounded flex-1"
            />
            <button
              onClick={addSemester}
              className="bg-red-700 text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-6">
            {semesters.length === 0 && (
              <div className="text-gray-500">No semesters yet.</div>
            )}

            {semesters.map((sem) => (
              <div key={sem.id} className="border rounded">
                <div className="px-4 py-3 flex items-center justify-between bg-gray-50">
                  <div className="font-semibold">{sem.semester_name}</div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openCourseForm(sem.id)}
                      className="px-3 py-1 border rounded"
                    >
                      Add Course
                    </button>
                    <button
                      onClick={() => deleteSemester(sem.id)}
                      className="px-3 py-1 border rounded text-red-600"
                    >
                      Delete Semester
                    </button>
                  </div>
                </div>

                {/* Course List */}
                <div className="p-4">
                  {sem.courses?.length ? (
                    <table className="min-w-full">
                      <thead>
                        <tr className="text-left">
                          <th>Course</th>
                          <th>Type</th>
                          <th>T</th>
                          <th>L</th>
                          <th>Tut</th>
                          <th>P</th>
                          <th>C</th>
                          <th></th>
                        </tr>
                      </thead>

                      <tbody>
                        {sem.courses.map((c) => (
                          <tr key={c.id} className="border-t">
                            <td className="py-2">{c.course_name}</td>
                            <td className="py-2">{c.course_type}</td>
                            <td className="py-2">{c.theory_hours}</td>
                            <td className="py-2">{c.lab_hours}</td>
                            <td className="py-2">{c.tutorial_hours}</td>
                            <td className="py-2">{c.practical_hours}</td>
                            <td className="py-2 font-semibold">{c.credits}</td>

                            <td className="py-2">
                              <button
                                onClick={() => openCourseForm(sem.id, c)}
                                className="px-2 py-1 border rounded mr-2"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteCourse(c.id)}
                                className="px-2 py-1 border rounded text-red-600"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-gray-500">
                      No courses in this semester.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Course Form */}
        {courseForm.semester_id && (
          <div className="mt-6 border-t pt-4">
            <h4 className="font-semibold mb-2">
              {editingCourseId ? "Edit Course" : "Add Course"}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                placeholder="Course name"
                value={courseForm.course_name}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, course_name: e.target.value })
                }
                className="px-3 py-2 border rounded md:col-span-2"
              />
              <input
                placeholder="Type (IC/PE/OE)"
                value={courseForm.course_type}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, course_type: e.target.value })
                }
                className="px-3 py-2 border rounded"
              />
              <input
                type="number"
                placeholder="T"
                value={courseForm.theory_hours}
                onChange={(e) =>
                  setCourseForm({
                    ...courseForm,
                    theory_hours: Number(e.target.value),
                  })
                }
                className="px-3 py-2 border rounded"
              />
              <input
                type="number"
                placeholder="L"
                value={courseForm.lab_hours}
                onChange={(e) =>
                  setCourseForm({
                    ...courseForm,
                    lab_hours: Number(e.target.value),
                  })
                }
                className="px-3 py-2 border rounded"
              />
              <input
                type="number"
                placeholder="Tut"
                value={courseForm.tutorial_hours}
                onChange={(e) =>
                  setCourseForm({
                    ...courseForm,
                    tutorial_hours: Number(e.target.value),
                  })
                }
                className="px-3 py-2 border rounded"
              />
              <input
                type="number"
                placeholder="P"
                value={courseForm.practical_hours}
                onChange={(e) =>
                  setCourseForm({
                    ...courseForm,
                    practical_hours: Number(e.target.value),
                  })
                }
                className="px-3 py-2 border rounded"
              />
              <input
                type="number"
                placeholder="Credits"
                value={courseForm.credits}
                onChange={(e) =>
                  setCourseForm({
                    ...courseForm,
                    credits: Number(e.target.value),
                  })
                }
                className="px-3 py-2 border rounded"
              />
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={saveCourse}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                {editingCourseId ? "Update" : "Create"}
              </button>

              <button
                onClick={() => {
                  setCourseForm({
                    semester_id: null,
                    course_name: "",
                    course_type: "IC",
                    theory_hours: 0,
                    lab_hours: 0,
                    tutorial_hours: 0,
                    practical_hours: 0,
                    credits: 0,
                    display_order: 0,
                  });
                  setEditingCourseId(null);
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </SimpleModal>
  );
};

export default CurriculumManager;
