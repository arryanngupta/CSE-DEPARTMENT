import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import AchievementCard from "../components/AchievementCard.jsx";
import Loading from "../components/Loading.jsx";
import SectionHeader from "../components/common/SectionHeader.jsx";
import PageWrapper from "../components/common/PageWrapper.jsx";
import { publicAPI } from "../lib/api.js";

const Achievements = ({ category }) => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, [category]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const res = await publicAPI.getAchievements({ category });
      setAchievements(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <section className="container mx-auto px-4 pb-16">
        <SectionHeader
          title={category === "faculty" ? "Faculty Achievements" : "Student Achievements"}
        />

        {loading ? <Loading /> : (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map(a => (
              <AchievementCard key={a.id} achievement={a} />
            ))}
          </motion.div>
        )}

        {!loading && achievements.length === 0 && (
          <p className="text-center text-gray-500 mt-12">No achievements found.</p>
        )}
      </section>
    </PageWrapper>
  );
};

export default Achievements;
