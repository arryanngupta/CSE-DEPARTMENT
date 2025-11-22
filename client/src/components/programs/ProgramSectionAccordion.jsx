// src/components/programs/ProgramSectionAccordion.jsx
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { publicAPI } from "../../lib/api.js";
import CurriculumTable from "./CurriculumTable.jsx";

/**
 * Renders all sections for a program as collapsible cards.
 * It fetches program details from /programs/:id
 */
const ProgramSectionAccordion = ({ programId }) => {
  const [details, setDetails] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!programId) return;
    loadProgramDetails(programId);
  }, [programId]);

  const loadProgramDetails = async (id) => {
    setLoading(true);
    try {
      const res = await publicAPI.getProgramDetails(id);
      // API returns { data: cleanProgram }
      const program = res.data.data;
      setDetails(program);

      // initialize expanded states using is_expanded if provided
      const init = {};
      (program.sections || []).forEach((s) => {
        init[s.id] = !!s.is_expanded;
      });
      setExpanded(init);
    } catch (err) {
      console.error("Failed to load program details:", err);
      setDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const toggle = (sectionId) => {
    setExpanded((p) => ({ ...p, [sectionId]: !p[sectionId] }));
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="inline-block animate-spin h-8 w-8 rounded-full border-b-2 border-red-700"></div>
      </div>
    );
  }

  if (!details || !details.sections || details.sections.length === 0) {
    return (
      <div className="bg-white rounded-md border p-6 text-gray-600">
        No sections available for this program.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {details.sections.map((section) => (
        <div
          key={section.id}
          className="border border-gray-300 rounded overflow-hidden bg-white"
        >
          {/* header */}
          <button
            onClick={() => toggle(section.id)}
            className="w-full flex items-center justify-between px-6 py-5 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 bg-red-700 rounded flex-shrink-0"></div>
              <h3 className="text-lg font-semibold text-gray-900">
                {section.title}
              </h3>
            </div>
            <div className="text-gray-600 flex-shrink-0">
              {expanded[section.id] ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </div>
          </button>

          {/* body */}
          {expanded[section.id] && (
            <div className="px-6 py-6 bg-white border-t border-gray-200">
              {/* Overview / Info content */}
              {(section.section_type === "overview" ||
                section.section_type === "info") &&
                section.content && (
                  <div
                    className="text-gray-700 leading-relaxed prose prose-sm max-w-none mb-8"
                    dangerouslySetInnerHTML={{
                      __html: section.content.content_html,
                    }}
                  />
                )}

              {/* If no content and overview/info, show fallback */}
              {(section.section_type === "overview" ||
                section.section_type === "info") &&
                !section.content && (
                  <div className="text-gray-600 italic">
                    No content available for this section.
                  </div>
                )}

              {/* Outcomes */}
              {section.section_type === "outcome" && (
                <>
                  {section.outcomes && section.outcomes.length > 0 ? (
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Programme Outcomes
                      </h4>
                      {section.outcomes.map((o) => (
                        <div key={o.id} className="flex gap-4">
                          <div className="min-w-[100px] font-semibold text-red-700">
                            {o.outcome_code}
                          </div>
                          <div className="text-gray-700 leading-relaxed">
                            {o.outcome_text}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-600 italic">
                      No outcomes available.
                    </div>
                  )}
                </>
              )}

              {/* Curriculum */}
              {section.section_type === "curriculum" && (
                <>
                  {section.semesters && section.semesters.length > 0 ? (
                    <div className="space-y-8">
                      {section.semesters.map((sem) => (
                        <div key={sem.id}>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            {sem.semester_number}
                            {sem.semester_number === 1 ||
                            sem.semester_number === 3 ||
                            sem.semester_number === 5 ||
                            sem.semester_number === 7
                              ? "st"
                              : sem.semester_number === 2 ||
                                sem.semester_number === 4 ||
                                sem.semester_number === 6 ||
                                sem.semester_number === 8
                              ? "nd"
                              : "th"}{" "}
                            Semester
                            {sem.semester_name && ` — ${sem.semester_name}`}
                          </h4>
                          <div className="bg-gray-50 border border-gray-200 rounded overflow-hidden">
                            <CurriculumTable
                              courses={sem.courses || []}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-600 italic">
                      No curriculum (semesters/courses) available.
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgramSectionAccordion;