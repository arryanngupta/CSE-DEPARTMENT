import { motion } from 'framer-motion';
import { getImageUrl } from '../utils/imageUtils';

const AchievementCard = ({ achievement }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: 'easeOut' }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.25, ease: 'easeOut' }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="group relative rounded-xl overflow-hidden bg-white border border-gray-100 hover:border-[#A6192E]/25 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {achievement.image_path && (
        <motion.div className="aspect-video overflow-hidden bg-gray-100 relative" whileHover="hover">
          <motion.img
            src={getImageUrl(achievement.image_path)}
            alt={achievement.title || 'Achievement image'}
            variants={imageVariants}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
      )}

      <div className="p-6">
        <motion.h3
          className="text-xl font-merriweather font-bold text-gray-900 mb-3 group-hover:text-[#A6192E] transition-colors"
        >
          {achievement.title}
        </motion.h3>

        {achievement.students && (
          <div className="flex items-center mb-3 text-sm">
            {/* ✅ FIXED SVG (No arc flag error) */}
            <svg
              className="w-5 h-5 text-[#A6192E] mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a4 4 0 00-5-4M17 20H7m10 0v-2a4 4 0 00-4-4M7 20H2v-2a4 4 0 015-4m0 0a4 4 0 018 0M16 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>

            <p className="text-[#A6192E] font-medium">{achievement.students}</p>
          </div>
        )}

        {achievement.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {achievement.description}
          </p>
        )}

        {achievement.link && (
          <motion.a
            href={achievement.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-[#A6192E] font-medium text-sm hover:text-[#7D0F22] group/link focus:outline-none focus:ring-2 focus:ring-[#A6192E]/30 rounded"
            whileHover={{ x: 5 }}
            transition={{ type: 'spring', stiffness: 450, damping: 18 }}
            aria-label="Read more about achievement"
          >
            Read More
            <svg
              className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </motion.a>
        )}
      </div>

      {/* Decorative underline */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#A6192E] via-[#7D0F22] to-[#A6192E] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

// Loading Skeleton
export const AchievementCardSkeleton = () => (
  <div className="rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm">
    <div className="aspect-video bg-gray-200 animate-pulse" />
    <div className="p-6 space-y-3">
      <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
      </div>
    </div>
  </div>
);

export default AchievementCard;
