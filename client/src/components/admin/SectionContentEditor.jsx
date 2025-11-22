// frontend/src/components/admin/SectionContentEditor.jsx
import { useEffect, useState } from "react";
import SimpleModal from "./SimpleModal.jsx";
import { adminAPI } from "../../lib/api.js";

const SectionContentEditor = ({ section, onClose }) => {
  const [open, setOpen] = useState(true);
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [section]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getProgramSections(section.program_id);
      const sec = (res.data.data || []).find((s) => s.id === section.id);

      setHtml(sec?.content?.content_html || "");
    } catch (err) {
      console.error(err);
      alert("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    try {
      await adminAPI.saveSectionContent({
        section_id: section.id,
        content_html: html,
      });

      alert("Saved");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save content");
    }
  };

  return (
    <SimpleModal
      open={open}
      title={`Edit Content: ${section.title}`}
      onClose={() => {
        setOpen(false);
        onClose();
      }}
      size="max-w-3xl"
    >
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              HTML Content (You can paste <b>full HTML</b> including tables)
            </label>

            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              rows={12}
              className="w-full p-3 border rounded font-mono text-sm"
              placeholder="<p>Write HTML here...</p>"
            />

            <div className="mt-3 flex gap-2">
              <button
                onClick={save}
                className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
              >
                Save
              </button>
              <button
                onClick={() => setHtml("")}
                className="px-4 py-2 border rounded"
              >
                Clear
              </button>
            </div>
          </>
        )}
      </div>
    </SimpleModal>
  );
};

export default SectionContentEditor;
