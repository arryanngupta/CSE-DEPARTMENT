import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Loading from '../components/Loading.jsx';
import { publicAPI } from '../lib/api.js';

const Directory = () => {
  const [directory, setDirectory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDirectory = async () => {
      try {
        const response = await publicAPI.getDirectory();
        setDirectory(response.data.data);
      } catch (error) {
        console.error('Error fetching directory:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDirectory();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#A6192E] mb-3">
          Department Directory
        </h1>
        <div className="h-1 w-24 bg-[#A6192E] mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
          Reach out to our department members directly. Whether academic or administrative —
          here’s everyone who helps make CSE at LNMIIT exceptional.
        </p>
      </div>

      {/* Directory Table */}
      {directory.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
        >
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#A6192E] text-white text-sm uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Role</th>
                  <th className="px-6 py-4 text-left font-semibold">Phone</th>
                  <th className="px-6 py-4 text-left font-semibold">Email</th>
                  <th className="px-6 py-4 text-left font-semibold">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700">
                <AnimatePresence>
                  {directory.map((entry) => (
                    <motion.tr
                      key={entry.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {entry.name}
                      </td>
                      <td className="px-6 py-4">{entry.role}</td>
                      <td className="px-6 py-4">
                        {entry.phone && (
                          <a
                            href={`tel:${entry.phone}`}
                            className="hover:text-[#A6192E] transition"
                          >
                            {entry.phone}
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {entry.email && (
                          <a
                            href={`mailto:${entry.email}`}
                            className="hover:text-[#A6192E] transition"
                          >
                            {entry.email}
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4">{entry.location}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-200">
            {directory.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 hover:bg-gray-50 transition rounded-lg"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {entry.name}
                </h3>
                <p className="text-sm text-gray-600 mb-1">{entry.role}</p>
                {entry.phone && (
                  <p className="text-sm text-gray-600">
                    📞{' '}
                    <a
                      href={`tel:${entry.phone}`}
                      className="hover:text-[#A6192E]"
                    >
                      {entry.phone}
                    </a>
                  </p>
                )}
                {entry.email && (
                  <p className="text-sm text-gray-600">
                    ✉️{' '}
                    <a
                      href={`mailto:${entry.email}`}
                      className="hover:text-[#A6192E]"
                    >
                      {entry.email}
                    </a>
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">{entry.location}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">
            No directory entries available at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default Directory;
