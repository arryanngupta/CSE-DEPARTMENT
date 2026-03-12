// client/src/components/FacultyAccordion.jsx
import { useId } from "react";

const MAROON = "bg-[#7a1414]"; // tuned maroon color

export default function FacultyAccordion({ section }) {
  const id = useId();

  // Normalize some common variations
  const type = (section.type || "text").toLowerCase();

  return (
    <details className="border" id={`sec-${id}`}>
      <summary
        className={`${MAROON} text-white px-6 py-3 font-serif font-semibold cursor-pointer select-none`}
      >
        {section.title}
      </summary>

      <div className="p-6 text-gray-800 space-y-4">
        {type === "table" && renderTable(section)}
        {type === "list" && renderList(section)}
        {type === "text" && <p className="whitespace-pre-line">{section.data}</p>}
        {type === "html" && (
          <div
            className="prose max-w-full"
            // caution: only use if you trust server HTML
            dangerouslySetInnerHTML={{ __html: section.data }}
          />
        )}
        {/* fallback */}
        {["table", "list", "text", "html"].indexOf(type) === -1 && (
          <p className="whitespace-pre-line">{String(section.data)}</p>
        )}
      </div>
    </details>
  );
}

function renderTable(section) {
  const columns = section.columns || [];
  const rows = section.data || []; // expecting array of arrays / objects

  // support array-of-objects by deriving columns
  let normalizedRows = rows;
  if (rows.length > 0 && typeof rows[0] === "object" && !Array.isArray(rows[0])) {
    if (columns.length === 0) {
      // derive columns from keys (first row)
      const keys = Object.keys(rows[0]);
      return (
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              {keys.map((k) => (
                <th key={k} className="border px-4 py-2 text-left font-medium">{k}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="odd:bg-white even:bg-gray-50">
                {keys.map((k) => (
                  <td key={k} className="border px-4 py-2 align-top">
                    {renderCell(r[k])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  }

  // array-of-arrays mode
  return (
    <table className="w-full border-collapse">
      {columns.length > 0 && (
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c, i) => (
              <th key={i} className="border px-4 py-2 text-left font-medium">{c}</th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {normalizedRows.map((row, i) => (
          <tr key={i} className="odd:bg-white even:bg-gray-50">
            {(Array.isArray(row) ? row : Object.values(row)).map((cell, j) => (
              <td key={j} className="border px-4 py-2 align-top">{renderCell(cell)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function renderList(section) {
  const items = Array.isArray(section.data)
    ? section.data
    : (section.data ? [section.data] : []);

  if (items.length === 0) {
    return <p className="text-gray-500 italic">No items</p>;
  }

  return (
    <ul className="list-disc pl-6 space-y-2">
      {items.map((it, i) => (
        <li key={i} className="leading-snug">
          {renderCell(it)}
        </li>
      ))}
    </ul>
  );
}


function renderCell(value) {
  if (value == null) return null;
  // if it's an object with url+text
  if (typeof value === "object" && value.url && value.text) {
    return (
      <a href={value.url} target="_blank" rel="noreferrer" className="underline text-blue-700">
        {value.text}
      </a>
    );
  }
  return typeof value === "string" ? value : String(value);
}