// src/components/AccordionCCE.jsx
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

/**
 * LNMIIT-style accordion (CCE-style)
 * Includes left red square + clean minimal layout.
 */

export default function AccordionCCE({
  id,
  title,
  meta = "",
  defaultOpen = false,
  children,
  onToggle,
}) {
  const [open, setOpen] = useState(defaultOpen);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    onToggle?.(next);
  };

  return (
    <div className="w-full mb-6">
      <div className="border border-gray-300 rounded overflow-hidden bg-white">
        {/* Header */}
        <button
          onClick={toggle}
          aria-expanded={open}
          aria-controls={id}
          className="w-full flex items-center justify-between px-6 py-5 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          {/* Left Part */}
          <div className="flex items-center gap-4">
            {/* Red Accent Box */}
            <div className="w-5 h-5 bg-red-700 rounded flex-shrink-0"></div>

            <div>
              <div className="text-lg font-semibold text-gray-900 leading-tight">
                {title}
              </div>

              {meta && (
                <div className="text-sm text-gray-600 leading-tight">{meta}</div>
              )}
            </div>
          </div>

          {/* Right Icon */}
          <div className="text-gray-600 flex-shrink-0">
            {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>

        {/* Body */}
        {open && (
          <div
            id={id}
            className="px-6 py-6 bg-white border-t border-gray-200"
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
}