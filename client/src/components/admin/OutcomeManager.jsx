// frontend/src/components/admin/OutcomeManager.jsx
import { useEffect, useState } from "react";
import SimpleModal from "./SimpleModal.jsx";
import { adminAPI } from "../../lib/api.js";

const OutcomeManager = ({ section, onClose }) => {
  const [open, setOpen] = useState(true);
  const [outcomes, setOutcomes] = useState([]);
  const [form, setForm] = useState({
    outcome_code: "",
    outcome_text: "",
    display_order: 0,
  });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [section]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getProgramSections(section.program_id);
      const sec = (res.data.data || []).find((s) => s.id === section.id);
      setOutcomes(sec?.outcomes || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load outcomes");
    } finally {
      setLoading(false);
    }
  };

  const createOutcome = async () => {
    if (!form.outcome_code || !form.outcome_text)
      return alert("Fill code & text");
    try {
      await adminAPI.createOutcome(section.id, {
  section_id: section.id,     // REQUIRED
  outcome_code: form.outcome_code,
  outcome_text: form.outcome_text,
  display_order: form.display_order,
});
      setForm({ outcome_code: "", outcome_text: "", display_order: 0 });
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to create outcome");
    }
  };

  const saveOutcome = async () => {
    if (!editingId) return createOutcome();
    try {
      await adminAPI.updateOutcome(editingId, form);
      setEditingId(null);
      setForm({ outcome_code: "", outcome_text: "", display_order: 0 });
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to update outcome");
    }
  };

  const deleteOutcome = async (id) => {
    if (!confirm("Delete outcome?")) return;
    try {
      await adminAPI.deleteOutcome(id);
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to delete outcome");
    }
  };

  return (
    <SimpleModal
      open={open}
      title={`Outcomes: ${section.title}`}
      onClose={() => {
        setOpen(false);
        onClose();
      }}
    >
      <div>
        {/* Form */}
        <div className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              placeholder="Code (PO-1)"
              value={form.outcome_code}
              onChange={(e) =>
                setForm({ ...form, outcome_code: e.target.value })
              }
              className="px-3 py-2 border rounded"
            />

            <input
              placeholder="Outcome text"
              value={form.outcome_text}
              onChange={(e) =>
                setForm({ ...form, outcome_text: e.target.value })
              }
              className="px-3 py-2 border rounded md:col-span-2"
            />
          </div>

          <div className="mt-2 flex gap-2">
            <button
              onClick={saveOutcome}
              className="bg-red-700 text-white px-4 py-2 rounded"
            >
              {editingId ? "Update" : "Add"} Outcome
            </button>

            <button
              onClick={() => {
                setForm({
                  outcome_code: "",
                  outcome_text: "",
                  display_order: 0,
                });
                setEditingId(null);
              }}
              className="px-4 py-2 border rounded"
            >
              Reset
            </button>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-3">
            {outcomes.length === 0 && (
              <div className="text-gray-500">No outcomes yet.</div>
            )}

            {outcomes.map((o) => (
              <div
                key={o.id}
                className="border p-3 rounded flex items-start justify-between"
              >
                <div>
                  <div className="font-semibold">{o.outcome_code}</div>
                  <div className="text-sm text-gray-700">{o.outcome_text}</div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(o.id);
                      setForm({
                        outcome_code: o.outcome_code,
                        outcome_text: o.outcome_text,
                        display_order: o.display_order,
                      });
                    }}
                    className="px-3 py-1 border rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteOutcome(o.id)}
                    className="px-3 py-1 border rounded text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SimpleModal>
  );
};

export default OutcomeManager;
