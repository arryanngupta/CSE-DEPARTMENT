export default function CurriculumTable({ courses }) {

  if (!courses.length) {
    return (
      <div className="text-gray-500 italic">
        No courses available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">

      <table className="w-full border text-sm">

        <thead className="bg-gray-100">

          <tr>
            <th className="border px-3 py-2 text-left">Course</th>
            <th className="border px-3 py-2">Type</th>
            <th className="border px-3 py-2">T</th>
            <th className="border px-3 py-2">L</th>
            <th className="border px-3 py-2">Tut</th>
            <th className="border px-3 py-2">P</th>
            <th className="border px-3 py-2">C</th>
          </tr>

        </thead>

        <tbody>

          {courses.map((c) => (

            <tr key={c.id} className="hover:bg-gray-50">

              <td className="border px-3 py-2">{c.course_name}</td>

              <td className="border px-3 py-2 text-center">
                {c.course_type || "-"}
              </td>

              <td className="border px-3 py-2 text-center">
                {c.theory_hours}
              </td>

              <td className="border px-3 py-2 text-center">
                {c.lab_hours}
              </td>

              <td className="border px-3 py-2 text-center">
                {c.tutorial_hours}
              </td>

              <td className="border px-3 py-2 text-center">
                {c.practical_hours}
              </td>

              <td className="border px-3 py-2 text-center font-semibold">
                {c.credits}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}