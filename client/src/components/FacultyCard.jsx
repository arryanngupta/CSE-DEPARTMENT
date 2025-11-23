import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';

export default function FacultyCard({ person }) {
  if (!person) return null;

  const slug =
    person.slug || person.name?.toLowerCase().trim().replace(/\s+/g, '-');

  return (
    <Link to={`/people/${slug}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 w-full max-w-xs mx-auto">

        {/* Photo Box */}
        <div className="w-full h-64 bg-gray-100 flex items-center justify-center overflow-hidden">

          {person.photo_path ? (
            <img
              src={person.photo_path}           // ✅ Cloudinary direct URL
              alt={person.name || "Faculty Photo"}
              className="max-h-full max-w-full object-contain"
              loading="lazy"                    // ⭐ Better performance
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
              <span className="text-gray-600 text-4xl">👤</span>
            </div>
          )}

        </div>

        {/* Content */}
        <div className="p-4 text-center">

          <h3 className="text-lg font-semibold text-gray-900 leading-snug">
            {person.name}
          </h3>

          <p className="text-sm text-red-700 font-medium mt-1 leading-tight">
            {person.designation || "Faculty Member"}
          </p>

          {person.email && (
            <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-600">
              <Mail size={14} className="text-red-700" />
              <span className="truncate">{person.email}</span>
            </div>
          )}

          {person.department && (
            <div className="flex items-center justify-center gap-2 text-xs text-gray-600 mt-1">
              <MapPin size={14} className="text-red-700" />
              <span className="truncate">{person.department}</span>
            </div>
          )}

          {person.research_areas && (
            <p className="text-xs text-gray-600 mt-3 line-clamp-2">
              <span className="font-medium">Research:</span> {person.research_areas}
            </p>
          )}

          <button className="w-full mt-4 py-2 bg-red-700 hover:bg-red-800 text-white text-sm font-medium rounded-lg">
            View Profile →
          </button>

        </div>

      </div>
    </Link>
  );
}
