import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "../components/Loading.jsx";
import { getImageUrl } from "../utils/imageUtils.js";

const Research = () => {
  const [research, setResearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get("type") || "All";
  const [category, setCategory] = useState(typeParam);

  useEffect(() => {
    fetchResearch();
  }, [category]);

  useEffect(() => {
    // Update category when query changes
    setCategory(typeParam);
  }, [typeParam]);

  const fetchResearch = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category !== "All") params.category = category;
      const response = await axios.get("/api/public/research", { params });
      setResearch(response.data.data || []);
    } catch (error) {
      console.error("Error fetching research:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", "Area", "Project", "Publication", "Patent"];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#A6192E] mb-3">
          Research
        </h1>
        <div className="h-1 w-24 bg-[#A6192E] mx-auto"></div>
        <p className="text-gray-600 mt-4 text-sm md:text-base max-w-2xl mx-auto">
          Explore our department’s cutting-edge research across diverse areas —
          from innovation-driven projects to impactful publications and patents.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
              category === cat
                ? "bg-[#A6192E] text-white border-[#A6192E] shadow-md scale-105"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <Loading />
      ) : research.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {research.map((item) => (
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
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  {item.category && (
                    <p className="text-xs uppercase text-[#A6192E] font-medium mb-2 tracking-wide">
                      {item.category}
                    </p>
                  )}
                  {item.faculty && (
                    <p className="text-sm text-gray-600 mb-2">
                      👨‍🏫 <span className="font-medium">{item.faculty}</span>
                    </p>
                  )}
                  {item.funding_agency && (
                    <p className="text-sm text-gray-500 mb-2">
                      💰 Funded by: {item.funding_agency}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-sm text-gray-500 line-clamp-3 mb-3">
                      {item.description}
                    </p>
                  )}
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-[#A6192E] hover:underline text-sm font-medium"
                    >
                      View More →
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center text-gray-500 py-10 text-lg">
          No research items found in this category.
        </div>
      )}
    </div>
  );
};

export default Research;
