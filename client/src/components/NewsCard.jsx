import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getImageUrl } from '../utils/imageUtils';

const NewsCard = ({ news }) => {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: 'easeOut' }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="group relative flex flex-col rounded-xl overflow-hidden bg-white border border-gray-100 hover:border-[#A6192E]/25 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {news.image_path && (
        <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
          <motion.img
            src={getImageUrl(news.image_path)}
            alt={news.title || 'News image'}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.25 }}
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-[#A6192E] shadow-sm">
            {formatDate(news.date)}
          </div>
        </div>
      )}

      <div className="flex flex-col flex-grow p-6">
        <h3 className="text-xl font-merriweather font-bold text-gray-900 mb-3 group-hover:text-[#A6192E] transition-colors line-clamp-2">
          {news.title}
        </h3>

        {news.summary && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{news.summary}</p>
        )}

        <Link to={`/news/${news.id}`} className="inline-flex items-center mt-auto" aria-label="Read full article">
          <motion.span
            className="inline-flex items-center text-[#A6192E] font-medium text-sm hover:text-[#7D0F22] group/link"
            whileHover={{ x: 5 }}
            transition={{ type: 'spring', stiffness: 450, damping: 18 }}
          >
            Read Full Article
            <svg className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.span>
        </Link>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#A6192E] via-[#7D0F22] to-[#A6192E] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

// Skeleton
export const NewsCardSkeleton = () => (
  <div className="rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm">
    <div className="aspect-[16/9] bg-gray-200 animate-pulse relative">
      <div className="absolute top-4 right-4 bg-gray-300 rounded-full h-6 w-24 animate-pulse" />
    </div>
    <div className="p-6 space-y-4">
      <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
      </div>
      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4 mt-4" />
    </div>
  </div>
);

export default NewsCard;
