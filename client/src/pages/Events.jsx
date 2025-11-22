import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard.jsx";
import Loading from "../components/Loading.jsx";
import { publicAPI } from "../lib/api.js";

const Events = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const initialType = queryParams.get("type") === "past" ? "past" : "upcoming";

  const [filter, setFilter] = useState(initialType);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const type = queryParams.get("type");
    if (type && type !== filter) {
      setFilter(type);
    }
  }, [location.search]);

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await publicAPI.getEvents({
        upcoming: filter === "upcoming" ? "1" : "0",
      });
      setEvents(response.data.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterClick = (type) => {
    setFilter(type);
    navigate(`/events?type=${type}`);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      {/* ===== Page Heading ===== */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-[#A6192E] mb-2">Events</h1>
        <div className="h-1 w-24 bg-[#A6192E] mx-auto rounded-full"></div>
      </div>

      {/* ===== Filter Tabs ===== */}
      <div className="flex justify-center space-x-4 mb-10 mt-4 relative z-10">
        <button
          onClick={() => handleFilterClick("upcoming")}
          className={`px-6 py-2 rounded-lg font-medium border transition-all duration-200 ${
            filter === "upcoming"
              ? "bg-[#A6192E] text-white border-[#A6192E] shadow-md scale-105"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          Upcoming Events
        </button>
        <button
          onClick={() => handleFilterClick("past")}
          className={`px-6 py-2 rounded-lg font-medium border transition-all duration-200 ${
            filter === "past"
              ? "bg-[#A6192E] text-white border-[#A6192E] shadow-md scale-105"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          Past Events
        </button>
      </div>

      {/* ===== Main Content ===== */}
      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {!loading && events.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No {filter} events found.</p>
        </div>
      )}
    </div>
  );
};

export default Events;
