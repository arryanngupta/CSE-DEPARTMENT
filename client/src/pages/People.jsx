import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FacultyCard from "../components/FacultyCard.jsx";
import Loading from "../components/Loading.jsx";
import { publicAPI } from "../lib/api.js";
import SEO from "../components/SEO.jsx";

const People = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    person_type: "",
    q: ""
  });

  /* ================= REDIRECT /people → Faculty ================= */

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const person_type = params.get("person_type");

    if (!person_type) {
      navigate("/people?person_type=Faculty", { replace: true });
      return;
    }

    setFilters((prev) => ({
      ...prev,
      person_type
    }));
  }, [location.search, navigate]);

  /* ================= FETCH PEOPLE ================= */

  useEffect(() => {
    const fetchPeople = async () => {
      setLoading(true);

      try {
        const res = await publicAPI.getPeople(filters);
        setPeople(res.data.data || []);
      } catch (e) {
        console.error("Error loading people", e);
      } finally {
        setLoading(false);
      }
    };

    if (filters.person_type) {
      fetchPeople();
    }

  }, [filters]);

  /* ================= SORTING ================= */

  const processedPeople = useMemo(() => {

    if (!filters.person_type) return people;

    const filtered = people.filter(
      (p) => p.person_type === filters.person_type
    );

    if (filters.person_type !== "Faculty") return filtered;

    const hod = filtered.filter((p) =>
      p.designation?.toLowerCase().includes("head")
    );

    const professors = filtered.filter(
      (p) =>
        p.designation?.toLowerCase().includes("professor") &&
        !p.designation?.toLowerCase().includes("associate") &&
        !p.designation?.toLowerCase().includes("assistant") &&
        !p.designation?.toLowerCase().includes("head")
    );

    const associate = filtered.filter((p) =>
      p.designation?.toLowerCase().includes("associate professor")
    );

    const assistant = filtered.filter((p) =>
      p.designation?.toLowerCase().includes("assistant professor")
    );

    const others = filtered.filter(
      (p) =>
        !p.designation?.toLowerCase().includes("professor") &&
        !p.designation?.toLowerCase().includes("associate") &&
        !p.designation?.toLowerCase().includes("assistant") &&
        !p.designation?.toLowerCase().includes("head")
    );

    return [
      ...hod,
      ...professors,
      ...associate,
      ...assistant,
      ...others
    ];

  }, [people, filters.person_type]);

  /* ================= PAGE TITLE ================= */

  const pageTitle = useMemo(() => {

    if (filters.person_type === "Faculty") return "Faculty Members";
    if (filters.person_type === "Staff") return "Staff Members";
    if (filters.person_type === "Research Scholar") return "Research Scholars";
    if (filters.person_type === "Alumni") return "Prominent Alumni";

    return "People";

  }, [filters.person_type]);

  if (loading) return <Loading />;

  return (
    <>
      <SEO
        title={`${pageTitle} | Department of Computer Science & Engineering | LNMIIT Jaipur`}
        description={`Meet the ${pageTitle.toLowerCase()} of the Department of Computer Science & Engineering at LNMIIT Jaipur.`}
        canonical="https://cse.lnmiit.ac.in/people"
      />

      <div className="container mx-auto px-4 py-10">

        {/* ===== Page Heading ===== */}

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#A6192E] mb-2">
            {pageTitle}
          </h1>

          <div className="h-1 w-24 bg-[#A6192E] mx-auto rounded-full"></div>
        </div>

        {/* ===== Search ===== */}

        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 mb-10">

          <input
            type="text"
            placeholder="Search by name..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
            value={filters.q}
            onChange={(e) =>
              setFilters({ ...filters, q: e.target.value })
            }
          />

        </div>

        {/* ===== Cards ===== */}

        {processedPeople.length > 0 ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

            {processedPeople.map((p) => (
              <FacultyCard key={p.id || p.slug} person={p} />
            ))}

          </div>

        ) : (

          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
            <p className="text-gray-700 font-medium">No records found</p>
          </div>

        )}

      </div>
    </>
  );
};

export default People;