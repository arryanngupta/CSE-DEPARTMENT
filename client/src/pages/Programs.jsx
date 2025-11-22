// src/pages/Programs.jsx

import { useEffect, useState } from "react";
import { publicAPI } from "../lib/api.js";
import { Download, ChevronDown, ChevronUp } from "lucide-react";
import CurriculumTable from "../components/CurriculumTable.jsx";

export default function Programs() {
  const [overview, setOverview] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);

  // Store program -> sections -> semesters -> courses
  const [programDetails, setProgramDetails] = useState({});
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    loadOverview();
    loadPrograms();
  }, []);

  async function loadOverview() {
    try {
      const resp = await publicAPI.getInfoBlock("programme_overview");
      setOverview(resp.data?.data || null);
    } catch (err) {
      console.warn("No overview found.");
      setOverview(null);
    }
  }

  async function loadPrograms() {
    setLoadingPrograms(true);
    try {
      const resp = await publicAPI.getPrograms();
      setPrograms(resp.data?.data || []);
    } catch (err) {
      console.error("Failed to load programs", err);
    } finally {
      setLoadingPrograms(false);
    }
  }

  async function ensureProgramDetails(programId) {
    if (programDetails[programId]) return;

    try {
      const resp = await publicAPI.getProgramDetails(programId);
      setProgramDetails((prev) => ({
        ...prev,
        [programId]: resp.data?.data || null,
      }));
    } catch (err) {
      console.error("Failed to fetch program details", err);
      setProgramDetails((prev) => ({
        ...prev,
        [programId]: { error: true },
      }));
    }
  }

  function toggleSection(sectionId) {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  }

  function handleProgramClick(programId) {
    ensureProgramDetails(programId);
  }

  if (loadingPrograms) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="inline-block animate-spin h-8 w-8 rounded-full border-b-2 border-red-700"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* ============================== */}
      {/* PROGRAMME OVERVIEW SECTION    */}
      {/* ============================== */}
      <div className="bg-white px-8 py-10 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">
            Programme Overview
          </h1>

          {overview?.content_html ? (
            <div
              className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: overview.content_html }}
            />
          ) : overview?.body ? (
            <p className="text-gray-700 leading-relaxed">{overview.body}</p>
          ) : (
            <p className="text-gray-600">No overview has been added yet.</p>
          )}

          {/* Divider */}
          <div className="border-t border-gray-300 mt-8"></div>
        </div>
      </div>

      {/* ============================== */}
      {/* PROGRAMS LIST SECTION         */}
      {/* ============================== */}
      <div className="bg-white px-8 py-10 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          {programs.map((program) => {
            const details = programDetails[program.id];

            return (
              <section key={program.id} className="mb-16">
                {/* PROGRAM HEADER ROW */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-8">
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-3">
                      {program.name}
                    </h2>

                    {program.overview && (
                      <p className="text-gray-700 leading-relaxed mb-4 max-w-2xl">
                        {program.overview}
                      </p>
                    )}

                    <div className="text-sm text-gray-700">
                      <span className="font-semibold">Level:</span>{" "}
                      <span>{program.level}</span>
                    </div>
                  </div>

                  {/* DOWNLOAD BUTTON */}
                  <div className="flex-shrink-0">
                    {program.curriculum_pdf_path ? (
                      <a
                        href={program.curriculum_pdf_path}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-5 py-3 rounded font-medium transition-colors"
                      >
                        <Download size={18} />
                        Download Curriculum PDF
                      </a>
                    ) : (
                      <button
                        disabled
                        className="inline-flex items-center gap-2 bg-gray-300 text-gray-600 px-5 py-3 rounded font-medium cursor-not-allowed"
                      >
                        <Download size={18} />
                        Curriculum Not Uploaded
                      </button>
                    )}
                  </div>
                </div>

                {/* PROGRAMME STRUCTURE HEADER */}
                <div className="mb-8">
                  <div className="bg-red-700 text-white px-5 py-3 inline-block font-semibold rounded-sm">
                    Programme Structure
                  </div>
                  <div className="border-t-2 border-gray-300 mt-4"></div>
                </div>

                {/* SECTIONS ACCORDION */}
                <div className="space-y-6">
                  {details === undefined ? (
                    <div
                      className="text-gray-600 cursor-pointer p-4 border rounded hover:bg-gray-50"
                      onClick={() => handleProgramClick(program.id)}
                    >
                      Click to load programme details...
                    </div>
                  ) : details?.error ? (
                    <div className="text-red-600 p-4 border border-red-200 rounded bg-red-50">
                      Failed to load programme data.
                    </div>
                  ) : details?.sections && details.sections.length > 0 ? (
                    details.sections.map((section) => {
                      const isExpanded = expandedSections[section.id];

                      return (
                        <div
                          key={section.id}
                          className="border border-gray-300 rounded overflow-hidden bg-white"
                        >
                          {/* SECTION HEADER BUTTON */}
                          <button
                            onClick={() => {
                              toggleSection(section.id);
                              if (!expandedSections[section.id]) {
                                handleProgramClick(program.id);
                              }
                            }}
                            className="w-full flex items-center justify-between px-6 py-5 bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-5 h-5 bg-red-700 rounded flex-shrink-0"></div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {section.title}
                              </h3>
                            </div>

                            <div className="text-gray-600 flex-shrink-0">
                              {isExpanded ? (
                                <ChevronUp size={20} />
                              ) : (
                                <ChevronDown size={20} />
                              )}
                            </div>
                          </button>

                          {/* SECTION CONTENT */}
                          {isExpanded && (
                            <div className="px-6 py-6 bg-white border-t border-gray-200">
                              {/* HTML Content (Info/Overview) */}
                              {section.content?.content_html && (
                                <div className="mb-8">
                                  <div
                                    className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{
                                      __html: section.content.content_html,
                                    }}
                                  />
                                </div>
                              )}

                              {/* Programme Outcomes */}
                              {section.outcomes && section.outcomes.length > 0 && (
                                <div className="mb-8">
                                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                    Programme Outcomes
                                  </h4>
                                  <div className="space-y-3">
                                    {section.outcomes.map((outcome) => (
                                      <div key={outcome.id} className="flex gap-4">
                                        <div className="min-w-[100px] font-semibold text-red-700">
                                          {outcome.outcome_code}
                                        </div>
                                        <div className="text-gray-700 leading-relaxed">
                                          {outcome.outcome_text}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Curriculum Semesters */}
                              {section.semesters && section.semesters.length > 0 && (
                                <div className="space-y-8">
                                  {section.semesters.map((semester) => (
                                    <div key={semester.id}>
                                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                        {semester.semester_number && (
                                          <>
                                            {semester.semester_number}
                                            {semester.semester_number === 1 || semester.semester_number === 3 || semester.semester_number === 5 || semester.semester_number === 7
                                              ? "st"
                                              : semester.semester_number === 2 || semester.semester_number === 4 || semester.semester_number === 6 || semester.semester_number === 8
                                              ? "nd"
                                              : "th"}{" "}
                                            Semester
                                          </>
                                        )}
                                        {semester.semester_name && (
                                          <>
                                            {semester.semester_number ? " — " : ""}
                                            {semester.semester_name}
                                          </>
                                        )}
                                      </h4>

                                      <div className="bg-gray-50 border border-gray-200 rounded overflow-hidden">
                                        <CurriculumTable
                                          courses={(semester.courses || []).sort(
                                            (a, b) => (a.display_order || 0) - (b.display_order || 0)
                                          )}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Empty State */}
                              {!section.content?.content_html &&
                                (!section.outcomes || section.outcomes.length === 0) &&
                                (!section.semesters || section.semesters.length === 0) && (
                                  <p className="text-gray-600 italic">
                                    No content available for this section.
                                  </p>
                                )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-gray-600 italic p-4">
                      No sections available for this programme.
                    </div>
                  )}
                </div>

                {/* Spacing between programs */}
                {program.id !== programs[programs.length - 1]?.id && (
                  <div className="border-t-2 border-gray-300 mt-16"></div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}