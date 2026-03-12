import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { publicAPI } from "../lib/api.js";
import Loading from "../components/Loading.jsx";

export default function Research() {
  const [research, setResearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const typeParam = searchParams.get("type"); 
  // Publication | Project | Patent | Collaboration | null

  useEffect(() => {
    loadResearch();
  }, []);

  async function loadResearch() {
    try {
      setLoading(true);
      const res = await publicAPI.getResearch();
      setResearch(res.data?.data || []);
    } catch (e) {
      console.error("Failed to load research", e);
    } finally {
      setLoading(false);
    }
  }

  /* ===== GROUP DATA ===== */
  const publications = useMemo(
    () => research.filter(r => r.category === "Publication"),
    [research]
  );

  const projects = useMemo(
    () => research.filter(r => r.category === "Project"),
    [research]
  );

  const patents = useMemo(
    () => research.filter(r => r.category === "Patent"),
    [research]
  );

  const collaborations = useMemo(
    () => research.filter(r => r.category === "Collaboration"),
    [research]
  );

  if (loading) return <Loading />;

  return (
    <div className="bg-white px-8 py-12">
      <div className="max-w-6xl mx-auto">

        {/* ===== PAGE HEADER ===== */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#A6192E] mb-3">Research</h1>
          <div className="h-1 w-24 bg-[#A6192E] mx-auto" />
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Explore publications, funded projects, patents and academic collaborations.
          </p>
        </div>

        {/* ================= PUBLICATIONS ================= */}
        {(!typeParam || typeParam === "Publication") && (
          <Section title="Research Publications">
            {publications.length ? (
              <ul className="space-y-4">
                {publications.map(p => (
                  <li key={p.id} className="border-b pb-4">
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-sm text-gray-600">
                      {p.authors} {p.journal && `— ${p.journal}`} {p.year && `(${p.year})`}
                    </div>
                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#A6192E] text-sm"
                      >
                        View Publication →
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : <Empty />}
          </Section>
        )}

        {/* ================= PROJECTS ================= */}
        {(!typeParam || typeParam === "Project") && (
          <Section title="Research Projects">
            {projects.length ? (
              <div className="grid md:grid-cols-2 gap-8">
                {projects.map(p => (
                  <div key={p.id} className="border rounded-lg p-5 shadow-sm">
                    <h3 className="font-semibold mb-2">{p.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{p.description}</p>
                    <div className="text-sm">
                      {p.faculty && <><strong>PI:</strong> {p.faculty}<br /></>}
                      {p.funding_agency && <><strong>Funding:</strong> {p.funding_agency}<br /></>}
                      {p.status && <><strong>Status:</strong> {p.status}</>}
                    </div>
                  </div>
                ))}
              </div>
            ) : <Empty />}
          </Section>
        )}

        {/* ================= PATENTS ================= */}
        {(!typeParam || typeParam === "Patent") && (
          <Section title="Patents">
            {patents.length ? (
              <div className="overflow-x-auto">
                <table className="w-full border">
                  <thead className="bg-[#8B0000] text-white">
                    <tr>
                      <th className="p-3 text-left">Title</th>
                      <th className="p-3 text-left">Inventors</th>
                      <th className="p-3 text-left">Application No.</th>
                      <th className="p-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patents.map(p => (
                      <tr key={p.id} className="border-t">
                        <td className="p-3">{p.title}</td>
                        <td className="p-3">{p.inventors}</td>
                        <td className="p-3">{p.application_no}</td>
                        <td className="p-3">{p.patent_status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <Empty />}
          </Section>
        )}

        {/* ================= COLLABORATIONS ================= */}
        {(!typeParam || typeParam === "Collaboration") && (
          <Section title="Collaborations">
            {collaborations.length ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {collaborations.map(c => (
                  <div key={c.id} className="text-center">
                    {c.image_path && (
                      <img
                        src={c.image_path}
                        alt={c.collaboration_org}
                        className="h-20 mx-auto object-contain"
                      />
                    )}
                    <div className="mt-3 font-medium">
                      {c.collaboration_org}
                    </div>
                  </div>
                ))}
              </div>
            ) : <Empty />}
          </Section>
        )}

      </div>
    </div>
  );
}

/* ===== Helpers ===== */
const Section = ({ title, children }) => (
  <section className="mb-20">
    <h2 className="text-3xl font-serif font-bold mb-8">{title}</h2>
    {children}
  </section>
);

const Empty = () => (
  <p className="italic text-gray-500">No items available.</p>
);
