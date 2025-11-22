// src/components/CurriculumTable.jsx

export default function CurriculumTable({ courses = [] }) {
  if (!courses || courses.length === 0) {
    return (
      <div className="px-6 py-6 text-gray-600 italic text-center">
        No courses available.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-white border-b-2 border-gray-300">
            <th className="text-left px-4 py-3 font-semibold text-gray-900 border-r border-gray-200">
              Course Name
            </th>
            <th className="px-3 py-3 text-center font-semibold text-gray-900 border-r border-gray-200">
              Type
            </th>
            <th className="px-3 py-3 text-center font-semibold text-gray-900 border-r border-gray-200">
              T
            </th>
            <th className="px-3 py-3 text-center font-semibold text-gray-900 border-r border-gray-200">
              L
            </th>
            <th className="px-3 py-3 text-center font-semibold text-gray-900 border-r border-gray-200">
              Tu
            </th>
            <th className="px-3 py-3 text-center font-semibold text-gray-900 border-r border-gray-200">
              P
            </th>
            <th className="px-3 py-3 text-center font-semibold text-gray-900">
              C
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {courses.map((course, index) => (
            <tr
              key={course.id || index}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100 transition-colors`}
            >
              <td className="px-4 py-3 text-gray-900 border-r border-gray-200">
                {course.course_name}
              </td>
              <td className="px-3 py-3 text-center text-gray-700 border-r border-gray-200">
                {course.course_type || "-"}
              </td>
              <td className="px-3 py-3 text-center text-gray-700 border-r border-gray-200">
                {course.theory_hours ?? 0}
              </td>
              <td className="px-3 py-3 text-center text-gray-700 border-r border-gray-200">
                {course.lab_hours ?? 0}
              </td>
              <td className="px-3 py-3 text-center text-gray-700 border-r border-gray-200">
                {course.tutorial_hours ?? 0}
              </td>
              <td className="px-3 py-3 text-center text-gray-700 border-r border-gray-200">
                {course.practical_hours ?? 0}
              </td>
              <td className="px-3 py-3 text-center text-gray-900 font-semibold">
                {course.credits ?? "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}