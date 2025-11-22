import { useEffect } from "react";
import { motion } from "framer-motion";

const PageWrapper = ({ children, noPadding = false }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={
        noPadding
          ? "min-h-screen m-0 p-0 overflow-hidden"
          : "min-h-screen pt-6 pb-12 px-4 md:px-8 lg:px-12"
          // pt-6 = 1.5rem (comfortable small gap under navbar)
      }
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
