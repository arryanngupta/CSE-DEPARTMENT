import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "../components/Loading.jsx";
import PageWrapper from "../components/common/PageWrapper.jsx";
import Pagination from "../components/common/Pagination.jsx";
import { getImageUrl } from "../utils/imageUtils.js";

const Facilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "All";
  const [category, setCategory] = useState(categoryParam);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    fetchFacilities();
  }, [category]);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category !== "All") params.category = category;
      const response = await axios.get("/api/public/facilities", { params });
      setFacilities(response.data.data || []);
    } catch (error) {
      console.error("Error fetching facilities:", error);
    } finally {
      setLoading(false);
      setCurrentPage(1);
    }
  };

  const categories = [
    "All",
    "Laboratory",
    "Infrastructure",
    "Equipment",
    "Software",
    "Other",
  ];

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = facilities.slice(indexOfFirst, indexOfLast);

  return (
    <PageWrapper title="Facilities">
      {/* ===== Page Heading ===== */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-[#A6192E] mb-2">Facilities</h1>
        <div className="h-1 w-24 bg-[#A6192E] mx-auto rounded-full"></div>
      </div>

      {/* ===== Category Filter Buttons ===== */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-300 
              ${
                category === cat
                  ? "bg-[#A6192E] text-white border-[#A6192E] shadow-md scale-105"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ===== Main Content ===== */}
      {loading ? (
        <Loading />
      ) : facilities.length > 0 ? (
        <>
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {currentItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  {item.image_path && (
                    <img
                      src={getImageUrl(item.image_path)}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.name}
                    </h3>
                    {item.category && (
                      <p className="text-xs uppercase text-[#A6192E] font-medium mb-2">
                        {item.category}
                      </p>
                    )}
                    {item.location && (
                      <p className="text-sm text-gray-600 mb-2">
                        📍 {item.location}
                      </p>
                    )}
                    {item.description && (
                      <p className="text-sm text-gray-500 line-clamp-3">
                        {item.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination */}
          <div className="mt-10">
            <Pagination
              currentPage={currentPage}
              totalItems={facilities.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 py-10 text-lg">
          No facilities found for this category.
        </div>
      )}
    </PageWrapper>
  );
};

export default Facilities;
