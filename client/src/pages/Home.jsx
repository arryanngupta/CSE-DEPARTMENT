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
        const [slidersRes, newsRes, eventsRes, achievementsRes, aboutRes] =
          await Promise.all([
            publicAPI.getSliders(),
            publicAPI.getNews({ published: 1, limit: 3 }),
            publicAPI.getEvents({ upcoming: 1, limit: 3 }),
            publicAPI.getAchievements({ limit: 3 }),
            publicAPI.getInfoBlock("about_department"),
          ]);

        setSliders(slidersRes.data.data);
        setNews(newsRes.data.data);
        setEvents(eventsRes.data.data);
        setAchievements(achievementsRes.data.data);
        setAboutInfo(aboutRes.data.data);
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

        {/* Glass Overlay */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 bg-gradient-to-t from-black/60 via-black/30 to-transparent"
        >
          <div className="backdrop-blur-lg bg-white/10 p-8 md:p-10 rounded-3xl shadow-xl border border-white/30 max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-merriweather font-bold text-white drop-shadow-lg"
            >
              Department of Computer Science & Engineering
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-4 text-lg md:text-xl text-gray-200 font-inter"
            >
              The LNM Institute of Information Technology, Jaipur
            </motion.p>
            <motion.div whileHover={{ scale: 1.05 }} className="mt-8 inline-flex">
              <Link
                to="/programs"
                className="px-6 py-3 bg-gradient-to-r from-[#7D0F22] via-[#A6192E] to-[#C93030] text-white font-semibold rounded-xl shadow-lg hover:shadow-red-500/40 transition-all"
              >
                Explore Our Programs →
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ===================== QUICK NAVIGATION ===================== */}
      {/* <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { path: "/", label: "Home" },
            { path: "/people", label: "People" },
            { path: "/programs", label: "Programs" },
            { path: "/newsletter", label: "Newsletter" },
          ].map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="relative group bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg hover:shadow-red-500/30 transition-all p-6 text-center text-white"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#A6192E]/80 via-[#B81F34]/80 to-[#A6192E]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h3 className="relative z-10 text-lg md:text-xl font-semibold font-inter">
                {item.label}
              </h3>
            </Link>
          ))}
        </motion.div>
      </div> */}

      {/* ===================== ABOUT SECTION ===================== */}
      {aboutInfo && (
        <section className="container mx-auto px-4 py-20">
          <SectionHeader title={aboutInfo.title} />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-lg text-gray-700 leading-relaxed text-justify font-inter max-w-4xl mx-auto"
          >
            {aboutInfo.body}
          </motion.p>
        </section>
      )}

      {/* ===================== STATS SECTION ===================== */}
      <section className="relative bg-gradient-to-r from-[#7D0F22] via-[#A6192E] to-[#8E3A8D] py-16 text-white">
        <div className="absolute inset-0 bg-[url('/src/assets/images/lnmiit_logo.png')] bg-center bg-contain bg-no-repeat opacity-5"></div>
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
          {[
            { value: "50+", label: "Faculty Members" },
            { value: "800+", label: "Students" },
            { value: "100+", label: "Research Publications" },
            { value: "95%", label: "Placement Rate" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg border border-white/20"
            >
              <div className="text-5xl font-bold font-merriweather mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-inter">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===================== NEWS SECTION ===================== */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex justify-between items-center mb-8">
          <SectionHeader title="Latest News" />
          <Link
            to="/news"
            className="text-[#A6192E] hover:underline font-medium font-inter"
          >
            View All →
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {news.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </motion.div>
      </section>

      {/* ===================== EVENTS SECTION ===================== */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <SectionHeader title="Upcoming Events" />
            <Link
              to="/events"
              className="text-[#A6192E] hover:underline font-medium font-inter"
            >
              View All →
            </Link>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===================== ACHIEVEMENTS SECTION ===================== */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex justify-between items-center mb-8">
          <SectionHeader title="Achievements" />
          <Link
            to="/achievements"
            className="text-[#A6192E] hover:underline font-medium font-inter"
          >
            View All →
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </motion.div>
      </section>
    </PageWrapper>
  );
};

export default Home;
