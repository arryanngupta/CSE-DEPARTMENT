// src/components/programs/OverviewBlock.jsx
import React from "react";

/**
 * Minimal overview block that shows the Programme Overview heading and the HTML content provided.
 * If html is empty shows fallback message similar to screenshot.
 */
const OverviewBlock = ({ html }) => {
  return (
    <div className="bg-white px-8 py-10 md:px-12 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">
          Programme Overview
        </h1>

        {html ? (
          <div
            className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <p className="text-gray-600">No overview content available.</p>
        )}

        {/* Divider */}
        <div className="border-t border-gray-300 mt-8"></div>
      </div>
    </div>
  );
};

export default OverviewBlock;