import { useState } from "react";
import { adminAPI } from "../../lib/api";

const ProgramOutcomeEditor = ({ section, refresh }) => {

  const [outcomes, setOutcomes] = useState(section.outcomes || []);

  const addOutcome = async () => {

    const code = prompt("Outcome Code (Example: PO1)");
    const text = prompt("Outcome Description");

    if (!code || !text) return;

    const res = await adminAPI.createOutcome(section.id, {
      outcome_code: code,
      outcome_text: text
    });

    setOutcomes([...outcomes, res.data.data]);
    refresh();
  };

  const updateOutcome = async (outcome) => {

    const text = prompt("Edit Outcome", outcome.outcome_text);
    if (!text) return;

    await adminAPI.updateOutcome(outcome.id, {
      outcome_text: text
    });

    refresh();
  };

  const deleteOutcome = async (id) => {

    if (!confirm("Delete this outcome?")) return;

    await adminAPI.deleteOutcome(id);

    refresh();
  };

  return (
    <div className="space-y-6">

      <button
        onClick={addOutcome}
        className="px-4 py-2 bg-red-700 text-white rounded"
      >
        + Add Outcome
      </button>

      <table className="w-full border">

        <thead className="bg-gray-100">

          <tr>
            <th className="border p-2 w-32">Code</th>
            <th className="border p-2">Outcome Description</th>
            <th className="border p-2 w-40">Actions</th>
          </tr>

        </thead>

        <tbody>

          {outcomes.map((o) => (

            <tr key={o.id}>

              <td className="border p-2 font-semibold">
                {o.outcome_code}
              </td>

              <td className="border p-2">
                {o.outcome_text}
              </td>

              <td className="border p-2 space-x-2">

                <button
                  onClick={() => updateOutcome(o)}
                  className="text-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteOutcome(o.id)}
                  className="text-red-600"
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default ProgramOutcomeEditor;