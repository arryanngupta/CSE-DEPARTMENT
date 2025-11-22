// src/components/programs/CurriculumTable.jsx
import React from "react";

/**
 * Simple curriculum table component.
 * Expects courses: [{ course_name, course_type, theory_hours, lab_hours, tutorial_hours, practical_hours, credits }]
 */
const CurriculumTable = ({ courses = [] }) => {
  if (!courses || courses.length === 0) {
    return <div className="text-gray-600">No courses to display.</div>;
  }

  return (
    <div className="overflow-x-auto border rounded">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left border">Course</th>
            <th className="px-4 py-2 text-center border">Type</th>
            <th className="px-4 py-2 text-center border">T</th>
            <th className="px-4 py-2 text-center border">L</th>
            <th className="px-4 py-2 text-center border">Tu</th>
            <th className="px-4 py-2 text-center border">P</th>
            <th className="px-4 py-2 text-center border">C</th>
          </tr>
        </thead>

        <tbody className="bg-white text-gray-800">
          {courses.map((c) => (
            <tr key={c.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-50">
              <td className="px-4 py-2 border">{c.course_name}</td>
              <td className="px-4 py-2 text-center border">{c.course_type || "IC"}</td>
              <td className="px-4 py-2 text-center border">{c.theory_hours ?? 0}</td>
              <td className="px-4 py-2 text-center border">{c.lab_hours ?? 0}</td>
              <td className="px-4 py-2 text-center border">{c.tutorial_hours ?? 0}</td>
              <td className="px-4 py-2 text-center border">{c.practical_hours ?? 0}</td>
              <td className="px-4 py-2 text-center border font-semibold">{c.credits ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CurriculumTable;
