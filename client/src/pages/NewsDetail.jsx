import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loading from '../components/Loading.jsx';
import { publicAPI } from '../lib/api.js';
import { getImageUrl } from '../utils/imageUtils.js';

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await publicAPI.getNewsById(id);
        setNews(response.data.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <Loading />;

  if (!news) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">News not found</h1>
          <Link to="/news" className="text-lnmiit-red hover:underline">
            ← Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link to="/news" className="inline-flex items-center text-lnmiit-red hover:underline mb-8">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to News
      </Link>

      <article className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{news.title}</h1>
       <p className="text-gray-500 mb-8">{formatDate(news.date)}</p>

        {news.image_path && (
          <img
            src={getImageUrl(news.image_path)}
            alt={news.title}
            className="w-full rounded-lg mb-8"
          />
        )}

        {news.summary && (
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <p className="text-lg text-gray-700">{news.summary}</p>
          </div>
        )}

        {news.body && (
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{news.body}</p>
          </div>
        )}
      </article>
    </div>
  );
};

export default NewsDetail;
