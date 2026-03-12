// src/components/EventCard.jsx
import { motion } from "framer-motion";

const EventCard = ({ event }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden h-full"
    >
      {event.banner_path && (
        <img
          src={event.banner_path}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-5 flex flex-col h-full">
        <h3 className="text-lg font-semibold text-[#8B0000] mb-2">
          {event.title}
        </h3>

        <p className="text-sm text-gray-500 mb-3">
          {new Date(event.startsAt).toDateString()}
        </p>

        {event.short_description && (
          <p className="text-gray-600 text-sm line-clamp-3">
            {event.short_description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default EventCard;
