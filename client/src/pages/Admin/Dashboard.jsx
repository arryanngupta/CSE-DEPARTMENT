import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../lib/api.js';

const Dashboard = () => {
  const [stats, setStats] = useState({
    sliders: 0,
    people: 0,
    programs: 0,
    news: 0,
    events: 0,
    achievements: 0,
    newsletters: 0,
    directory: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [sliders, people, programs, news, events, achievements, newsletters, directory] = await Promise.all([
          adminAPI.getSliders(),
          adminAPI.getPeople(),
          adminAPI.getPrograms(),
          adminAPI.getNews(),
          adminAPI.getEvents(),
          adminAPI.getAchievements(),
          adminAPI.getNewsletters(),
          adminAPI.getDirectory()
        ]);

        setStats({
          sliders: sliders.data.data.length,
          people: people.data.data.length,
          programs: programs.data.data.length,
          news: news.data.data.length,
          events: events.data.data.length,
          achievements: achievements.data.data.length,
          newsletters: newsletters.data.data.length,
          directory: directory.data.data.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { title: 'Hero Sliders', count: stats.sliders, icon: '🖼️', link: '/admin/sliders', color: 'bg-blue-500' },
    { title: 'Faculty Members', count: stats.people, icon: '👥', link: '/admin/people', color: 'bg-green-500' },
    { title: 'Programs', count: stats.programs, icon: '📚', link: '/admin/programs', color: 'bg-purple-500' },
    { title: 'News Articles', count: stats.news, icon: '📰', link: '/admin/news', color: 'bg-yellow-500' },
    { title: 'Events', count: stats.events, icon: '📅', link: '/admin/events', color: 'bg-red-500' },
    { title: 'Achievements', count: stats.achievements, icon: '🏆', link: '/admin/achievements', color: 'bg-indigo-500' },
    { title: 'Newsletters', count: stats.newsletters, icon: '📄', link: '/admin/newsletters', color: 'bg-pink-500' },
    { title: 'Directory Entries', count: stats.directory, icon: '📞', link: '/admin/directory', color: 'bg-teal-500' }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lnmiit-red"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.color} text-white p-3 rounded-lg text-2xl`}>
                  {card.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900">{card.count}</div>
              </div>
              <h3 className="text-lg font-semibold text-gray-700">{card.title}</h3>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/news" className="btn-primary text-center">
            Add News Article
          </Link>
          <Link to="/admin/events" className="btn-primary text-center">
            Add Event
          </Link>
          <Link to="/admin/people" className="btn-primary text-center">
            Add Faculty Member
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;