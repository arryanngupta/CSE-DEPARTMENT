// src/pages/FacultyProfile.jsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, Phone, Globe, Calendar, Building2 } from 'lucide-react';
import { publicAPI } from '../lib/api.js';
import Loading from '../components/Loading.jsx';

export default function FacultyProfile() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFaculty = async () => {
      setLoading(true);
      try {
        const res = await publicAPI.getPersonBySlug(slug);
        setFaculty(res.data?.data);
      } catch (err) {
        console.error('Error loading faculty:', err);
        setError('Faculty member not found');
      } finally {
        setLoading(false);
      }
    };

    if (slug) loadFaculty();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (error || !faculty) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Faculty Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'This faculty member does not exist.'}</p>
          <button
            onClick={() => navigate('/people')}
            className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded transition-colors"
          >
            Back to Faculty
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const parseResearchAreas = (areas) => {
    if (!areas) return [];
    return typeof areas === 'string' ? areas.split(',').map(a => a.trim()) : areas;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Back Button */}
      <div className="bg-white px-8 py-4 md:px-12 lg:px-16 border-b border-gray-200">
        <button
          onClick={() => navigate('/people')}
          className="text-red-700 hover:text-red-800 font-medium text-sm transition-colors"
        >
          ← Back to Faculty
        </button>
      </div>

      {/* Main Content */}
      <div className="px-8 py-10 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            
            {/* ===== LEFT SIDEBAR ===== */}
            <div className="md:col-span-1">
              {/* Profile Card */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                {/* Photo */}
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  {faculty.photo_path ? (
                    <img
                      src={faculty.photo_path}
                      alt={faculty.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                      <span className="text-gray-400 text-4xl">📷</span>
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="p-6">
                  <h1 className="text-2xl font-serif font-bold text-gray-900 mb-1">
                    {faculty.name}
                  </h1>
                  
                  <p className="text-red-700 font-semibold text-sm mb-6 leading-tight">
                    {faculty.designation || 'Faculty Member'}
                  </p>

                  {/* Contact Info */}
                  <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                    {faculty.email && (
                      <div className="flex items-start gap-3">
                        <Mail size={16} className="text-red-700 flex-shrink-0 mt-1" />
                        <div className="text-xs">
                          <p className="text-gray-600 font-medium">Email</p>
                          <a
                            href={`mailto:${faculty.email}`}
                            className="text-red-700 hover:underline break-all"
                          >
                            {faculty.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {faculty.phone && (
                      <div className="flex items-start gap-3">
                        <Phone size={16} className="text-red-700 flex-shrink-0 mt-1" />
                        <div className="text-xs">
                          <p className="text-gray-600 font-medium">Phone</p>
                          <a href={`tel:${faculty.phone}`} className="text-red-700 hover:underline">
                            {faculty.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {faculty.webpage && (
                      <div className="flex items-start gap-3">
                        <Globe size={16} className="text-red-700 flex-shrink-0 mt-1" />
                        <div className="text-xs">
                          <p className="text-gray-600 font-medium">Website</p>
                          <a
                            href={faculty.webpage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-700 hover:underline break-all"
                          >
                            Visit
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Joining Info */}
                  {faculty.joining_date && (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Calendar size={16} className="text-gray-600 flex-shrink-0 mt-1" />
                        <div className="text-xs">
                          <p className="text-gray-600 font-medium">Date of joining</p>
                          <p className="text-gray-900 font-semibold">{formatDate(faculty.joining_date)}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {faculty.department && (
                    <div className="flex items-start gap-3 mt-3">
                      <Building2 size={16} className="text-gray-600 flex-shrink-0 mt-1" />
                      <div className="text-xs">
                        <p className="text-gray-600 font-medium">Department</p>
                        <p className="text-gray-900 font-semibold">{faculty.department}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ===== RIGHT CONTENT ===== */}
            <div className="md:col-span-2 lg:col-span-3 space-y-8">
              
              {/* Summary Section */}
              {faculty.bio && (
                <div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Summary</h2>
                  <p className="text-gray-700 leading-relaxed text-justify">
                    {faculty.bio}
                  </p>
                </div>
              )}

              {/* Biography (same as summary for now) */}
              {faculty.bio && (
                <div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Biography</h2>
                  <p className="text-gray-700 leading-relaxed text-justify">
                    {faculty.bio}
                  </p>
                </div>
              )}

              {/* Research Area */}
              {faculty.research_areas && (
                <div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Research Area</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {faculty.research_areas}
                  </p>
                </div>
              )}

              {/* Personal Information Table */}
              <div>
                <h2 className="bg-red-700 text-white px-4 py-3 font-bold text-lg mb-4 inline-block">
                  Personal Information
                </h2>
                <div className="border border-gray-300 rounded overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-gray-300">
                        <td className="bg-gray-50 px-6 py-3 font-semibold text-gray-900 w-1/3">Name</td>
                        <td className="px-6 py-3 text-gray-700">{faculty.name}</td>
                      </tr>
                      <tr className="border-b border-gray-300">
                        <td className="bg-gray-50 px-6 py-3 font-semibold text-gray-900">Designation</td>
                        <td className="px-6 py-3 text-gray-700">{faculty.designation || 'N/A'}</td>
                      </tr>
                      <tr className="border-b border-gray-300">
                        <td className="bg-gray-50 px-6 py-3 font-semibold text-gray-900">Department</td>
                        <td className="px-6 py-3 text-gray-700">{faculty.department || 'N/A'}</td>
                      </tr>
                      <tr className="border-b border-gray-300">
                        <td className="bg-gray-50 px-6 py-3 font-semibold text-gray-900">Email</td>
                        <td className="px-6 py-3 text-gray-700">
                          {faculty.email ? (
                            <a href={`mailto:${faculty.email}`} className="text-red-700 hover:underline">
                              {faculty.email}
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-300">
                        <td className="bg-gray-50 px-6 py-3 font-semibold text-gray-900">Phone</td>
                        <td className="px-6 py-3 text-gray-700">{faculty.phone || 'N/A'}</td>
                      </tr>
                      <tr className="border-b border-gray-300">
                        <td className="bg-gray-50 px-6 py-3 font-semibold text-gray-900">Date of joining</td>
                        <td className="px-6 py-3 text-gray-700">{formatDate(faculty.joining_date)}</td>
                      </tr>
                      <tr>
                        <td className="bg-gray-50 px-6 py-3 font-semibold text-gray-900">Website</td>
                        <td className="px-6 py-3 text-gray-700">
                          {faculty.webpage ? (
                            <a
                              href={faculty.webpage}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-700 hover:underline"
                            >
                              Visit
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Education Section */}
              {faculty.education && faculty.education.length > 0 && (
                <div>
                  <h2 className="bg-red-700 text-white px-4 py-3 font-bold text-lg mb-4 inline-block">
                    Education
                  </h2>
                  <div className="space-y-4">
                    {faculty.education.map((edu, idx) => (
                      <div key={idx} className="border-l-4 border-red-700 pl-4">
                        <h3 className="font-semibold text-gray-900">{edu.degree || 'Degree'}</h3>
                        <p className="text-gray-600">{edu.institution || 'Institution'}</p>
                        <p className="text-sm text-gray-500">{edu.year || 'Year'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Publications Section */}
              {faculty.publications && faculty.publications.length > 0 && (
                <div>
                  <h2 className="bg-red-700 text-white px-4 py-3 font-bold text-lg mb-4 inline-block">
                    Publications
                  </h2>
                  <div className="space-y-4">
                    {faculty.publications.map((pub, idx) => (
                      <div key={idx} className="border-l-4 border-red-700 pl-4">
                        <h3 className="font-semibold text-gray-900">{pub.title || 'Publication'}</h3>
                        <p className="text-gray-600">{pub.venue || 'Venue'}</p>
                        <p className="text-sm text-gray-500">{pub.year || 'Year'}</p>
                        {pub.link && (
                          <a
                            href={pub.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-700 hover:underline text-sm mt-1"
                          >
                            Read More →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Workshops Section */}
              {faculty.workshops && faculty.workshops.length > 0 && (
                <div>
                  <h2 className="bg-red-700 text-white px-4 py-3 font-bold text-lg mb-4 inline-block">
                    Workshops Attended
                  </h2>
                  <div className="space-y-4">
                    {faculty.workshops.map((workshop, idx) => (
                      <div key={idx} className="border-l-4 border-red-700 pl-4">
                        <h3 className="font-semibold text-gray-900">{workshop.title || 'Workshop'}</h3>
                        <p className="text-sm text-gray-500">{workshop.date || 'Date'}</p>
                        {workshop.venue && <p className="text-gray-600">{workshop.venue}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}