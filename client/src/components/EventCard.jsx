import { motion } from 'framer-motion';

const EventCard = ({ event }) => {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: 'easeOut' }
    }
  };

  const isUpcoming = event?.startsAt ? new Date(event.startsAt) > new Date() : false;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="group relative rounded-xl overflow-hidden bg-white border border-gray-100 hover:border-[#A6192E]/25 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {event.banner_path && (
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          <motion.img
            src={event.banner_path}  // ✅ Cloudinary direct URL
            alt={event.title || 'Event banner'}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.25 }}
            loading="lazy"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Status */}
          <div
            className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-sm ${
              isUpcoming ? 'bg-[#A6192E] text-white' : 'bg-white/90 text-gray-800'
            }`}
          >
            {isUpcoming ? 'Upcoming' : 'Past Event'}
          </div>
        </div>
      )}

      <div className="p-6 space-y-4">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-5 h-5 mr-2 text-[#A6192E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {event.startsAt && (
            <time dateTime={event.startsAt} className="font-medium">
              {formatDate(event.startsAt)}
            </time>
          )}
        </div>

        <h3 className="text-xl font-merriweather font-bold text-gray-900 group-hover:text-[#A6192E] transition-colors">
          {event.title}
        </h3>

        {event.venue && (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-5 h-5 mr-2 text-[#A6192E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.venue}</span>
          </div>
        )}

        {event.description && (
          <p className="text-gray-600 text-sm line-clamp-3">{event.description}</p>
        )}

        {event.link && (
          <motion.a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-[#A6192E] font-medium text-sm hover:text-[#7D0F22]"
            whileHover={{ x: 5 }}
            transition={{ type: 'spring', stiffness: 450, damping: 18 }}
          >
            {isUpcoming ? 'Register Now' : 'Learn More'}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.a>
        )}
      </div>

      {isUpcoming && (
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#A6192E] via-[#7D0F22] to-[#A6192E] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </motion.div>
  );
};

export default EventCard;
