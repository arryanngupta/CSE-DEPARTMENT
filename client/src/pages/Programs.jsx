import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { publicAPI } from "../lib/api.js";
import { Download, ChevronDown, ChevronUp } from "lucide-react";
import CurriculumTable from "../components/CurriculumTable.jsx";

export default function Programs() {

  const location = useLocation();

  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);

  const [programDetails, setProgramDetails] = useState({});
  const [expandedSections, setExpandedSections] = useState({});

  /* ================= LOAD PROGRAM LIST ================= */

  useEffect(() => {
    loadPrograms();
  }, []);

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

  /* ================= HASH NAVIGATION ================= */

  const activeHash = useMemo(() => {
    return location.hash.replace("#", "") || "doctoral";
  }, [location.hash]);

  /* ================= GROUP PROGRAMS ================= */

  const groupedPrograms = useMemo(() => ({

    doctoral: programs.filter((p) => p.level === "PhD"),
    masters: programs.filter((p) => p.level === "PG"),
    bachelors: programs.filter((p) => p.level === "UG"),

  }), [programs]);

  /* ================= SCROLL FIX ================= */

  useEffect(() => {

    window.scrollTo({ top: 0, behavior: "instant" });

  }, [activeHash]);

  /* ================= LOAD PROGRAM DETAILS ================= */

  async function ensureProgramDetails(programId) {

    if (programDetails[programId]) return;

    try {

      const resp = await publicAPI.getProgramDetails(programId);

      setProgramDetails((prev) => ({
        ...prev,
        [programId]: resp.data?.data || null
      }));

    } catch (err) {

      console.error(err);

      setProgramDetails((prev) => ({
        ...prev,
        [programId]: { error: true }
      }));

    }

  }

  /* ================= TOGGLE SECTION ================= */

  function toggleSection(programId, sectionId) {

    ensureProgramDetails(programId);

    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));

  }

  /* ================= PROGRAM LOADING ================= */

  if (loadingPrograms) {

    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin h-8 w-8 border-b-2 border-red-700 rounded-full" />
      </div>
    );

  }

  /* ================= SECTION RENDERER ================= */

  const renderSection = (title, list) => {

    if (!list || list.length === 0) return null;

    return (

      <section className="mb-24">

        <h2 className="text-4xl font-serif font-bold text-gray-900 mb-12">
          {title}
        </h2>

        {list.map((program) => {

          const details = programDetails[program.id];

          return (

            <section key={program.id} className="mb-20">

              {/* ================= PROGRAM HEADER ================= */}

              <div className="mb-10">

                <h3 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                  {program.name}
                </h3>

                <div className="border-b-4 border-black w-40 mb-6"></div>

                <div className="flex flex-col md:flex-row md:justify-between gap-6">

                  <div className="text-gray-700 text-sm space-y-1">

                    <div><strong>Level:</strong> {program.level}</div>

                    {program.duration && (
                      <div><strong>Duration:</strong> {program.duration}</div>
                    )}

                    {program.total_credits && (
                      <div><strong>Total Credits:</strong> {program.total_credits}</div>
                    )}

                  </div>

                  {program.curriculum_pdf_path && (

                    <a
                      href={program.curriculum_pdf_path}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-red-700 text-white px-5 py-3 rounded hover:bg-red-800"
                    >
                      <Download size={18} />
                      Download Curriculum
                    </a>

                  )}

                </div>

              </div>

              {/* ================= OVERVIEW ================= */}

              {program.overview && (

                <div className="mb-10 text-gray-700 leading-relaxed">
                  {program.overview}
                </div>

              )}

              {/* ================= PROGRAM STRUCTURE ================= */}

              <div className="mb-8">

                <div className="bg-red-800 text-white px-6 py-3 inline-block font-semibold">
                  Programme Structure
                </div>

                <div className="border-t-2 border-gray-300 mt-4"></div>

              </div>

              {/* ================= PROGRAM SECTIONS ================= */}

              <div className="space-y-4">

                {!details ? (

                  <div
                    onClick={() => ensureProgramDetails(program.id)}
                    className="cursor-pointer border p-4 rounded hover:bg-gray-50"
                  >
                    Click to load programme details...
                  </div>

                ) : details.error ? (

                  <p className="text-red-600">
                    Failed to load programme details.
                  </p>

                ) : details.sections?.length ? (

                  details.sections.map((section) => {

                    const open = expandedSections[section.id];

                    return (

                      <div key={section.id} className="border rounded overflow-hidden">

                        <button
                          onClick={() => toggleSection(program.id, section.id)}
                          className="w-full flex justify-between px-6 py-4 bg-red-800 text-white font-semibold"
                        >
                          <span>{section.title}</span>
                          {open ? <ChevronUp /> : <ChevronDown />}
                        </button>

                        {open && (

                          <div className="p-6 bg-gray-50 border-t">

                            {/* ================= HTML CONTENT ================= */}

                            {section.content?.content_html && (

                              <div
                                className="prose max-w-none mb-8"
                                dangerouslySetInnerHTML={{
                                  __html: section.content.content_html
                                }}
                              />

                            )}

                            {/* ================= SEMESTERS ================= */}

                            {section.semesters?.map((sem) => (

                              <div key={sem.id} className="mb-10">

                                <h5 className="font-semibold text-lg mb-4">
                                  {sem.semester_name}
                                </h5>

                                <CurriculumTable courses={sem.courses || []} />

                              </div>

                            ))}

                            {/* ================= OUTCOMES ================= */}

                            {section.outcomes?.length > 0 && (

                              <div className="space-y-3">

                                {section.outcomes.map((o) => (

                                  <div key={o.id} className="flex gap-3">

                                    <div className="font-semibold">
                                      {o.outcome_code}
                                    </div>

                                    <div className="text-gray-700">
                                      {o.outcome_text}
                                    </div>

                                  </div>

                                ))}

                              </div>

                            )}

                          </div>

                        )}

                      </div>

                    );

                  })

                ) : (

                  <p className="italic text-gray-600">
                    No sections available for this programme.
                  </p>

                )}

              </div>

            </section>

          );

        })}

      </section>

    );

  };

  /* ================= PAGE ================= */

  return (

    <div className="bg-white px-8 py-10 md:px-12 lg:px-16">

      <div className="max-w-6xl mx-auto">

        {activeHash === "doctoral" &&
          renderSection("Doctoral Programmes", groupedPrograms.doctoral)}

        {activeHash === "masters" &&
          renderSection("Masters Programmes", groupedPrograms.masters)}

        {activeHash === "bachelors" &&
          renderSection("Bachelors Programmes", groupedPrograms.bachelors)}

      </div>

    </div>

  );

}