// src/components/ProgramHeader.jsx
import React from 'react';
import { Download } from 'lucide-react';

/**
 * Program Header Component
 * Displays program name, description, metadata, and download button
 */
const ProgramHeader = ({ program }) => {
  return (
    <div className="w-full">
      {/* PROGRAM HEADER ROW */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-8">
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-3">
            {program.name}
          </h2>

          {program.overview && (
            <p className="text-gray-700 leading-relaxed mb-4 max-w-2xl">
              {program.overview}
            </p>
          )}

          {program.description && (
            <p className="text-gray-700 leading-relaxed mb-4">
              {program.description}
            </p>
          )}

          <div className="flex flex-wrap gap-6 text-sm text-gray-700">
            {program.level && (
              <div>
                <span className="font-semibold">Level:</span> {program.level}
              </div>
            )}
            {program.duration && (
              <div>
                <span className="font-semibold">Duration:</span> {program.duration}
              </div>
            )}
            {program.total_credits && (
              <div>
                <span className="font-semibold">Total Credits:</span>{" "}
                {program.total_credits}
              </div>
            )}
          </div>
        </div>

        {/* DOWNLOAD BUTTON */}
        <div className="flex-shrink-0">
          {program.curriculum_pdf_path ? (
            <a
              href={program.curriculum_pdf_path}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-5 py-3 rounded font-medium transition-colors"
            >
              <Download size={18} />
              Download Curriculum PDF
            </a>
          ) : (
            <button
              disabled
              className="inline-flex items-center gap-2 bg-gray-300 text-gray-600 px-5 py-3 rounded font-medium cursor-not-allowed"
            >
              <Download size={18} />
              Curriculum Not Uploaded
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramHeader;