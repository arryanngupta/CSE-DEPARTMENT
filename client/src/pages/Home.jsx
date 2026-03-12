// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Slider from "../components/Slider.jsx";
import NewsCard from "../components/NewsCard.jsx";
import EventCard from "../components/EventCard.jsx";
import AchievementCard from "../components/AchievementCard.jsx";
import Loading from "../components/Loading.jsx";
import SectionHeader from "../components/common/SectionHeader.jsx";
import PageWrapper from "../components/common/PageWrapper.jsx";
import { publicAPI } from "../lib/api.js";

const Home = () => {
  const [sliders, setSliders] = useState([]);
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [aboutInfo, setAboutInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          slidersRes,
          newsRes,
          eventsRes,
          achievementsRes,
          aboutRes,
        ] = await Promise.all([
          publicAPI.getSliders(),
          publicAPI.getNews({ published: 1, limit: 3 }),
          publicAPI.getEvents({ upcoming: 1, limit: 3 }),
          publicAPI.getAchievements({ limit: 3 }),
          publicAPI.getInfoBlock("about_department"),
        ]);

        setSliders(slidersRes?.data?.data || []);
        setNews(newsRes?.data?.data || []);
        setAchievements(achievementsRes?.data?.data || []);
        setAboutInfo(aboutRes?.data?.data || null);

        const eventList = Array.isArray(eventsRes?.data?.data)
          ? eventsRes.data.data
          : [];

        setEvents(eventList);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <PageWrapper noPadding>
      {/* ===================== HERO SECTION ===================== */}
      <div className="relative w-full min-h-[75vh] md:min-h-[85vh] overflow-hidden">
        <Slider slides={sliders} />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 bg-gradient-to-t from-black/60 via-black/30 to-transparent"
        >
          <div className="backdrop-blur-lg bg-white/10 p-8 md:p-10 rounded-3xl shadow-xl border border-white/30 max-w-3xl">
            <motion.h1 className="text-4xl md:text-6xl font-merriweather font-bold text-white">
              Department of Computer Science & Engineering
            </motion.h1>
            <motion.p className="mt-4 text-lg md:text-xl text-gray-200">
              The LNM Institute of Information Technology, Jaipur
            </motion.p>
            <motion.div className="mt-8 inline-flex">
              <Link
                to="/programs"
                className="px-6 py-3 bg-gradient-to-r from-[#7D0F22] via-[#A6192E] to-[#C93030] text-white font-semibold rounded-xl shadow-lg"
              >
                Explore Our Programs →
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ===================== ABOUT SECTION ===================== */}
      {aboutInfo && (
        <section className="container mx-auto px-4 py-20">
          <SectionHeader title={aboutInfo.title} />
          <motion.p className="text-lg text-gray-700 leading-relaxed text-justify max-w-4xl mx-auto">
            {aboutInfo.body}
          </motion.p>
        </section>
      )}

      {/* ===================== 🔴 STATS PLATE (STATIC) ===================== */}
      <section className="bg-gradient-to-r from-[#7D0F22] via-[#A6192E] to-[#C93030] py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-white">

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center shadow-lg">
              <h3 className="text-4xl font-bold">50+</h3>
              <p className="mt-2 text-sm uppercase tracking-wide">Faculty Members</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center shadow-lg">
              <h3 className="text-4xl font-bold">800+</h3>
              <p className="mt-2 text-sm uppercase tracking-wide">Students</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center shadow-lg">
              <h3 className="text-4xl font-bold">100+</h3>
              <p className="mt-2 text-sm uppercase tracking-wide">Research Publications</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center shadow-lg">
              <h3 className="text-4xl font-bold">95%</h3>
              <p className="mt-2 text-sm uppercase tracking-wide">Placement Rate</p>
            </div>

          </div>
        </div>
      </section>

      {/* ===================== NEWS SECTION ===================== */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex justify-between items-center mb-8">
          <SectionHeader title="Latest News" />
          <Link to="/news" className="text-[#A6192E] hover:underline">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      </section>

      {/* ===================== EVENTS SECTION ===================== */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <SectionHeader title="Upcoming Events" />
            <Link to="/events" className="text-[#A6192E] hover:underline">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== ACHIEVEMENTS SECTION ===================== */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex justify-between items-center mb-8">
          <SectionHeader title="Achievements" />
          <Link to="/achievements" className="text-[#A6192E] hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </section>
    </PageWrapper>
  );
};

export default Home;
