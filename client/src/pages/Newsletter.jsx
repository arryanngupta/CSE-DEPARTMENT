import { useState, useEffect } from 'react';
import Loading from '../components/Loading.jsx';
import { publicAPI } from '../lib/api.js';

const Newsletter = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const response = await publicAPI.getNewsletters();
        setNewsletters(response.data.data);
      } catch (error) {
        console.error('Error fetching newsletters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletters();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-lnmiit-red mb-8">Department Newsletter</h1>
      <div className="h-1 w-24 bg-lnmiit-red mb-12"></div>

      {newsletters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsletters.map((newsletter) => (
            <div key={newsletter.id} className="card hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(newsletter.issueDate)}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">{newsletter.title}</h3>

                {newsletter.description && (
                  <p className="text-gray-600 text-sm mb-4">{newsletter.description}</p>
                )}

                <a
                  href={newsletter.pdf_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-lnmiit-red hover:underline font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No newsletters available.</p>
        </div>
      )}
    </div>
  );
};

export default Newsletter;
