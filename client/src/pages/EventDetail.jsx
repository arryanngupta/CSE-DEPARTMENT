import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../components/Loading.jsx";
import PageWrapper from "../components/common/PageWrapper.jsx";
import { publicAPI } from "../lib/api.js";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    publicAPI.getEventById(id).then((res) => {
      setEvent(res.data.data);
    });
  }, [id]);

  if (!event) return <Loading />;

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <h1 className="text-4xl font-bold mb-3">{event.title}</h1>
        <p className="text-gray-500 mb-6">
          {new Date(event.startsAt).toDateString()}
        </p>

        {event.banner_path && (
          <img
            src={event.banner_path}
            alt={event.title}
            className="w-full rounded-xl mb-10"
          />
        )}

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: event.description }}
        />

        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-8 text-[#8B0000] font-semibold underline"
          >
            More Information →
          </a>
        )}
      </div>
    </PageWrapper>
  );
};

export default EventDetail;
