// client/src/components/FacultySidebar.jsx
import { Mail, Globe, Calendar, Building2 } from "lucide-react";

export default function FacultySidebar({ faculty }) {
  const formatDate = (d) => {
    if (!d) return "N/A";
    try {
      return new Date(d).toLocaleDateString("en-GB");
    } catch {
      return d;
    }
  };

  return (
    <aside className="lg:col-span-1">
      <div className="border shadow-sm overflow-hidden bg-white">
        {/* profile image */}
        <div className="w-full h-64 bg-gray-100">
          <img
            src={faculty.photo || faculty.photo_path || "/placeholder-profile.png"}
            alt={faculty.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* meta */}
        <div className="p-6">
          <h2 className="font-serif text-2xl font-bold">{faculty.name}</h2>
          <p className="text-red-800 font-semibold mt-1">{faculty.designation}</p>

          <div className="mt-4 text-sm text-gray-800 space-y-2">
            {faculty.email && (
              <p className="flex items-center">
                <Mail size={14} className="inline mr-2 text-gray-600" />
                <a href={`mailto:${faculty.email}`} className="underline">{faculty.email}</a>
              </p>
            )}

            {faculty.website && (
              <p className="flex items-center">
                <Globe size={14} className="inline mr-2 text-gray-600" />
                <a href={faculty.website} target="_blank" rel="noreferrer" className="underline">
                  Website
                </a>
              </p>
            )}

            {faculty.joining_date && (
              <p className="flex items-center">
                <Calendar size={14} className="inline mr-2 text-gray-600" />
                {formatDate(faculty.joining_date)}
              </p>
            )}

            {faculty.department && (
              <p className="flex items-center">
                <Building2 size={14} className="inline mr-2 text-gray-600" />
                {faculty.department}
              </p>
            )}
          </div>

          {/* optional small links (ORCID/Scopus/LinkedIn) */}
          <div className="mt-6 space-x-3">
            {faculty.orcid && (
              <a href={faculty.orcid} target="_blank" rel="noreferrer" className="text-sm underline">
                ORCID
              </a>
            )}
            {faculty.scopus && (
              <a href={faculty.scopus} target="_blank" rel="noreferrer" className="text-sm underline">
                Scopus
              </a>
            )}
            {faculty.linkedin && (
              <a href={faculty.linkedin} target="_blank" rel="noreferrer" className="text-sm underline">
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
