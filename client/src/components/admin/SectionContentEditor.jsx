import { useEffect, useState, useRef } from "react";
import SimpleModal from "./SimpleModal.jsx";
import { adminAPI } from "../../lib/api.js";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import CurriculumEditor from "./CurriculumEditor";
import ProgramOutcomeEditor from "./ProgramOutcomeEditor";

const SectionContentEditor = ({ section, onClose }) => {
  const [open, setOpen] = useState(true);
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);

  const quillRef = useRef();

  /* ================= IMAGE UPLOAD HANDLER ================= */

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await adminAPI.uploadEditorImage(formData);
        const imageUrl = res.data.url;

        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(true);

        quill.insertEmbed(range.index, "image", imageUrl);
      } catch (err) {
        console.error(err);
        alert("Image upload failed");
      }
    };
  };

  /* ================= QUILL TOOLBAR ================= */

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        ["blockquote", "code-block"],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "align",
    "color",
    "background",
    "blockquote",
    "code-block",
    "link",
    "image",
  ];

  /* ================= LOAD CONTENT ================= */

  useEffect(() => {
    if (
      section.section_type === "curriculum" ||
      section.section_type === "outcome"
    ) {
      setLoading(false);
      return;
    }

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

  /* ================= SAVE CONTENT ================= */

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

  /* ================= UI ================= */

  return (
    <SimpleModal
      open={open}
      title={`Edit Content: ${section.title}`}
      onClose={() => {
        setOpen(false);
        onClose();
      }}
      size="max-w-4xl"
    >
      <div>

        {/* ================= CURRICULUM EDITOR ================= */}

        {section.section_type === "curriculum" && (
          <CurriculumEditor
            section={section}
            refresh={load}
          />
        )}

        {/* ================= PROGRAM OUTCOMES EDITOR ================= */}

        {section.section_type === "outcome" && (
          <ProgramOutcomeEditor
            section={section}
            refresh={load}
          />
        )}

        {/* ================= RICH TEXT SECTIONS ================= */}

        {(section.section_type === "overview" ||
          section.section_type === "info") && (
          <>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Content (Rich Text Editor)
                </label>

                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={html}
                  onChange={setHtml}
                  modules={modules}
                  formats={formats}
                  className="bg-white"
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
          </>
        )}

      </div>
    </SimpleModal>
  );
};

export default SectionContentEditor;