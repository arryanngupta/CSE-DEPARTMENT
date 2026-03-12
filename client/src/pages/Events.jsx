// src/pages/Events.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EventCard from "../components/EventCard.jsx";
import Loading from "../components/Loading.jsx";
import SectionHeader from "../components/common/SectionHeader.jsx";
import PageWrapper from "../components/common/PageWrapper.jsx";
import { publicAPI } from "../lib/api.js";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const limit = 6;

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line
  }, [page]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await publicAPI.getEvents({
        page,
        limit,
        order: "DESC", // latest first
      });

      setEvents(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  const today = new Date();

  const upcomingEvents = events.filter(
    (e) => new Date(e.startsAt) >= today
  );

  const pastEvents = events.filter(
    (e) => new Date(e.startsAt) < today
  );

  return (
    <PageWrapper>
      <section className="container mx-auto px-4 py-16">
        <SectionHeader title="Events" />

        {/* ================= UPCOMING / LATEST EVENTS ================= */}
        {upcomingEvents.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold mt-10 mb-6 text-[#8B0000]">
              Upcoming & Latest Events
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="block"
                >
                  <EventCard event={event} />
                </Link>
              ))}
            </div>
          </>
        )}

        {/* ================= PAST EVENTS ================= */}
        {pastEvents.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold mt-16 mb-6 text-gray-700">
              Past Events
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-90">
              {pastEvents.map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="block"
                >
                  <EventCard event={event} />
                </Link>
              ))}
            </div>
          </>
        )}

        {/* ================= PAGINATION ================= */}
        <div className="flex justify-center items-center gap-4 mt-16">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="px-4 py-2 bg-[#8B0000] text-white rounded">
            {page}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border rounded"
          >
            Next
          </button>
        </div>
      </section>
    </PageWrapper>
  );
};

export default Events;
