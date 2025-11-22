// src/components/OutcomeList.jsx
import React from 'react';

/**
 * OutcomeList
 * - outcomes: [{ outcome_code, outcome_text }]
 */
const OutcomeList = ({ outcomes = [] }) => {
  return (
    <div className="space-y-4">
      {outcomes.length > 0 ? (
        outcomes.map((outcome) => (
          <div key={outcome.id} className="flex gap-4">
            <div className="min-w-[100px] font-semibold text-red-700">
              {outcome.outcome_code}
            </div>
            <div className="text-gray-700 leading-relaxed">
              {outcome.outcome_text}
            </div>
          </div>
        ))
      ) : (
        <div className="text-gray-600 italic">No outcomes available.</div>
      )}
    </div>
  );
};

export default OutcomeList; 