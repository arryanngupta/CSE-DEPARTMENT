// src/components/common/Pagination.jsx
import { motion } from "framer-motion";

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    onPageChange(newPage);
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-12 select-none">
      {/* Previous Button */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => changePage(page - 1)}
        disabled={page === 1}
        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all
          ${page === 1
            ? "border-gray-300 text-gray-400 cursor-not-allowed"
            : "border-[#A6192E] text-[#A6192E] hover:bg-[#A6192E] hover:text-white"
          }`}
      >
        Previous
      </motion.button>

      {/* Page Indicator */}
      <div className="px-4 py-2 text-sm font-medium bg-white/60 backdrop-blur-md rounded-lg shadow-sm border border-purple-300/40">
        Page <span className="text-[#A6192E] font-semibold">{page}</span> of {totalPages}
      </div>

      {/* Next Button */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => changePage(page + 1)}
        disabled={page === totalPages}
        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all
          ${page === totalPages
            ? "border-gray-300 text-gray-400 cursor-not-allowed"
            : "border-[#A6192E] text-[#A6192E] hover:bg-[#A6192E] hover:text-white"
          }`}
      >
        Next
      </motion.button>
    </div>
  );
};

export default Pagination;
