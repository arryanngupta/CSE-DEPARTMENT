import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Loading from "../components/Loading";
import FacultySidebar from "../components/FacultySidebar";
import FacultyAccordion from "../components/FacultyAccordion";
import { publicAPI } from "../lib/api.js";
import SEO from "../components/SEO.jsx";


export default function FacultyProfile() {
  const { slug } = useParams();

  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ======================= DATA FETCH ======================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await publicAPI.getPersonBySlug(slug);

        // API is normalized → always use res.data.data
        setFaculty(res?.data?.data || null);
      } catch (err) {
        console.error("Faculty profile load failed:", err);
        setError("Failed to load faculty profile.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProfile();
  }, [slug]);

  /* ======================= STATES ======================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loading />
      </div>
    );
  }

  if (error || !faculty) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-700 font-medium">
            {error || "Faculty profile not found."}
          </p>
        </div>
      </div>
    );
  }

  /* ======================= PAGE ======================= */
  return (
    <>
    <SEO
          title={`${faculty.name} — ${faculty.designation} | Department of CSE | LNMIIT Jaipur`}
          description={`${faculty.name}, ${faculty.designation} at LNMIIT Jaipur. Research interests: ${faculty.research || "Not specified."}`}
          keywords={`${faculty.name}, ${faculty.research || ""}, LNMIIT CSE, faculty`}
          canonical={`https://cse.lnmiit.ac.in/people/${faculty.slug}`}
        />
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* ======================= LEFT SIDEBAR ======================= */}
        <FacultySidebar faculty={faculty} />

        {/* ======================= RIGHT CONTENT ======================= */}
        <main className="lg:col-span-3 space-y-12">
          {/* SUMMARY */}
          {faculty.summary && (
            <section>
              <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-3">
                Summary
              </h1>
              <p className="text-gray-800 leading-relaxed whitespace-pre-line text-justify">
                {faculty.summary}
              </p>
            </section>
          )}

          {/* BIOGRAPHY */}
          {faculty.biography && (
            <section>
              <h2 className="font-serif text-2xl lg:text-3xl font-bold mb-3">
                Biography
              </h2>
              <p className="text-gray-800 leading-relaxed whitespace-pre-line text-justify">
                {faculty.biography}
              </p>
            </section>
          )}

          {/* RESEARCH AREA */}
          {faculty.research_area && (
            <section>
              <h2
                className={`font-serif font-bold mb-3 ${
                  faculty.summary || faculty.biography
                    ? "text-2xl lg:text-3xl"
                    : "text-3xl lg:text-4xl"
                }`}
              >
                Research Area
              </h2>

              <p className="text-gray-800 leading-relaxed">
                {faculty.research_area}
              </p>
            </section>
          )}

          {/* ======================= ACCORDION SECTIONS ======================= */}
          <div className="space-y-4">
            {Array.isArray(faculty.sections) && faculty.sections.length > 0 ? (
              faculty.sections.map((section, index) => (
                <FacultyAccordion
                  key={`${section.title}-${index}`}
                  section={section}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No additional details available.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
    </>
  );
}
