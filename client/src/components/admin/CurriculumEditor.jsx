import { useState } from "react";
import { adminAPI } from "../../lib/api";

const CurriculumEditor = ({ section, refresh }) => {

  const [semesters, setSemesters] = useState(section.semesters || []);

  const addSemester = async () => {
    const name = prompt("Semester name (Example: Semester 1)");
    const number = prompt("Semester number");

    if (!name || !number) return;

    const res = await adminAPI.createSemester(section.id, {
      semester_name: name,
      semester_number: number
    });

    setSemesters([...semesters, res.data.data]);
    refresh();
  };

  const addCourse = async (semesterId) => {

    const course_name = prompt("Course Name");
    const credits = prompt("Credits");

    if (!course_name || !credits) return;

    await adminAPI.createCourse(semesterId, {
      course_name,
      credits,
      theory_hours: 3,
      tutorial_hours: 1,
      lab_hours: 0,
      practical_hours: 0
    });

    refresh();
  };

  const deleteCourse = async (courseId) => {
    if (!confirm("Delete course?")) return;

    await adminAPI.deleteCourse(courseId);
    refresh();
  };

  return (
    <div className="space-y-6">

      <button
        onClick={addSemester}
        className="px-4 py-2 bg-red-700 text-white rounded"
      >
        + Add Semester
      </button>

      {semesters.map((sem) => (
        <div key={sem.id} className="border rounded p-4">

          <h3 className="text-lg font-semibold mb-3">
            {sem.semester_name}
          </h3>

          <table className="w-full border">

            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Course</th>
                <th className="border p-2">L</th>
                <th className="border p-2">T</th>
                <th className="border p-2">P</th>
                <th className="border p-2">Credits</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>

            <tbody>

              {sem.courses?.map((course) => (
                <tr key={course.id}>

                  <td className="border p-2">
                    {course.course_name}
                  </td>

                  <td className="border p-2">
                    {course.theory_hours}
                  </td>

                  <td className="border p-2">
                    {course.tutorial_hours}
                  </td>

                  <td className="border p-2">
                    {course.lab_hours}
                  </td>

                  <td className="border p-2">
                    {course.credits}
                  </td>

                  <td className="border p-2">

                    <button
                      onClick={() => deleteCourse(course.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

          <button
            onClick={() => addCourse(sem.id)}
            className="mt-3 px-3 py-1 border rounded"
          >
            + Add Course
          </button>

        </div>
      ))}

    </div>
  );
};

export default CurriculumEditor;