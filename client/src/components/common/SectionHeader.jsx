// src/components/common/SectionHeader.jsx
import { motion } from "framer-motion";

const SectionHeader = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-12">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-3xl md:text-4xl font-bold text-[#A6192E] drop-shadow-sm"
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-600 mt-2 max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}

      {/* Accent Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
        className="relative mx-auto mt-4 h-1 w-24 bg-gradient-to-r from-[#A6192E] via-purple-600 to-[#A6192E] rounded-full"
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 blur-md bg-purple-500/40 rounded-full"></div>
      </motion.div>
    </div>
  );
};

export default SectionHeader;
