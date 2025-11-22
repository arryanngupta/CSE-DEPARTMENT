import { useState, useEffect } from "react";
import FacultyCard from "../components/FacultyCard.jsx";
import Loading from "../components/Loading.jsx";
import { publicAPI } from "../lib/api.js";

const People = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ designation: "", q: "" });

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
    fetchPeople();
  }, [filters]);

  return (
    <div className="container mx-auto px-4 py-10">
      {/* ===== Page Heading ===== */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-[#A6192E] mb-2">
          Faculty Members
        </h1>
        <div className="h-1 w-24 bg-[#A6192E] mx-auto rounded-full"></div>
      </div>

      {/* ===== Filters ===== */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 mb-10">
        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by name..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          />
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
            value={filters.designation}
            onChange={(e) =>
              setFilters({ ...filters, designation: e.target.value })
            }
          >
            <option value="">All Designations</option>
            <option value="Professor">Professor</option>
            <option value="Associate Professor">Associate Professor</option>
            <option value="Assistant Professor">Assistant Professor</option>
          </select>
          <button
            onClick={() => setFilters({ designation: "", q: "" })}
            className="bg-[#A6192E] text-white rounded-lg text-sm font-medium hover:bg-[#8B0000] transition px-4 py-2"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* ===== Faculty Cards ===== */}
      {loading ? (
        <Loading />
      ) : people.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {people.map((p) => (
            <FacultyCard key={p.id || p._id || p.email} person={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-700 font-medium">No faculty found</p>
          <p className="text-gray-500 text-sm mt-1">
            Try adjusting filters or searching again.
          </p>
        </div>
      )}
    </div>
  );
};

export default People;
