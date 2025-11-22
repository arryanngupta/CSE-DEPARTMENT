// frontend/src/components/admin/SimpleModal.jsx
import React from "react";

const SimpleModal = ({ open, title, onClose, children, size = "max-w-3xl" }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-40"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div
        className={`relative bg-white rounded-lg shadow-xl w-full ${size} max-h-[90vh] overflow-auto`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>

          <button
            className="text-gray-600 hover:text-gray-900"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default SimpleModal;
