// src/components/CollapsibleSection.jsx
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * CollapsibleSection
 * Props:
 *  - title (string)
 *  - isOpen (bool)
 *  - onToggle (fn)
 *  - children (content when open)
 *  - sectionType (string) used to optionally change color/behavior
 */
const CollapsibleSection = ({ title, isOpen, onToggle, children }) => {
  return (
    <section className="w-full">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between bg-red-700 text-white px-6 py-4 hover:bg-red-800 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          <div className="text-xl font-bold">
            {isOpen ? '−' : '+'}
          </div>
          <div className="font-semibold text-lg">{title}</div>
        </div>
        <div className="opacity-90">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {isOpen && (
        <div className="bg-white border border-t-0 border-gray-300 p-6">
          {children}
        </div>
      )}
    </section>
  );
};

export default CollapsibleSection;