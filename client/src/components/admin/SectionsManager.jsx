// frontend/src/components/admin/SectionsManager.jsx
import { useEffect, useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Settings,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { adminAPI } from '../../lib/api.js';

import CurriculumManager from './CurriculumManager.jsx';
import OutcomeManager from './OutcomeManager.jsx';
import SectionContentEditor from './SectionContentEditor.jsx';

/**
 * SectionsManager
 * Props:
 *  - programId (number) required
 *  - onClose (fn) optional
 *
 * Allows admin to create/update/delete sections and open modals to manage
 * curriculum (semesters & courses), outcomes and HTML content.
 */
export default function SectionsManager({ programId, onClose = () => {} }) {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // form state for create/edit
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // section object when editing
  const [form, setForm] = useState({
    title: '',
    section_type: 'curriculum',
    display_order: 0,
    is_expanded: false,
  });

  // UI state for expanded toggles but we also respect server is_expanded
  const [localExpanded, setLocalExpanded] = useState({});

  // modal state
  const [openCurriculumFor, setOpenCurriculumFor] = useState(null); // section object
  const [openOutcomesFor, setOpenOutcomesFor] = useState(null); // section object
  const [openContentFor, setOpenContentFor] = useState(null); // section object

  useEffect(() => {
    if (!programId) return;
    fetchSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programId]);

  async function fetchSections() {
    setLoading(true);
    try {
      const res = await adminAPI.getProgramSections(programId);
      const list = res?.data?.data || [];
      // sort by display_order
      list.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
      setSections(list);

      // localExpanded from server flag
      const ex = {};
      list.forEach((s) => {
        ex[s.id] = !!s.is_expanded;
      });
      setLocalExpanded(ex);
    } catch (err) {
      console.error('fetchSections error', err);
      alert('Failed to fetch sections. See console for details.');
      setSections([]);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm({
      title: '',
      section_type: 'curriculum',
      display_order: 0,
      is_expanded: false,
    });
    setShowForm(true);
  }

  function openEdit(section) {
    setEditing(section);
    setForm({
      title: section.title || '',
      section_type: section.section_type || 'curriculum',
      display_order: section.display_order ?? 0,
      is_expanded: !!section.is_expanded,
    });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e?.preventDefault?.();
    setSaving(true);
    try {
      const payload = {
        program_id: programId,
        title: form.title,
        section_type: form.section_type,
        display_order: parseInt(form.display_order || 0, 10),
        is_expanded: !!form.is_expanded,
      };

      if (editing) {
        await adminAPI.updateProgramSection(editing.id, payload);
        alert('Section updated successfully');
      } else {
        await adminAPI.createProgramSection(programId, payload);
        alert('Section created successfully');
      }

      setShowForm(false);
      setEditing(null);
      await fetchSections();
    } catch (err) {
      console.error('save section error', err);
      const msg = err?.response?.data?.error || err?.message || 'Failed to save section';
      alert(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this section? This will also delete linked semesters/outcomes/content.')) return;
    try {
      await adminAPI.deleteProgramSection(id);
      alert('Section deleted');
      fetchSections();
    } catch (err) {
      console.error('delete section error', err);
      alert('Failed to delete section. See console for details.');
    }
  }

  async function toggleExpand(sectionId) {
    const newVal = !localExpanded[sectionId];
    // optimistic UI
    setLocalExpanded((p) => ({ ...p, [sectionId]: newVal }));

    try {
      await adminAPI.updateProgramSection(sectionId, { is_expanded: newVal });
      // update local sections too
      setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, is_expanded: newVal } : s)));
    } catch (err) {
      console.error('toggleExpand error', err);
      alert('Failed to update expand state on server.');
      // revert
      setLocalExpanded((p) => ({ ...p, [sectionId]: !newVal }));
    }
  }

  // After modal actions, re-fetch sections to reflect changes
  function handleModalCloseAndRefresh() {
    setOpenCurriculumFor(null);
    setOpenOutcomesFor(null);
    setOpenContentFor(null);
    fetchSections();
  }

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center p-6">
      <div
        className="absolute inset-0 bg-black opacity-40"
        onClick={() => onClose()}
        aria-hidden="true"
      />
      <div className="relative z-50 w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-auto max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <Settings size={20} />
            <h3 className="text-lg font-semibold">Manage Sections</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800"
            >
              <Plus size={16} /> Add Section
            </button>

            <button
              onClick={() => onClose()}
              className="inline-flex items-center gap-2 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            >
              <X size={16} /> Close
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {loading ? (
            <div className="text-center py-10">Loading sections...</div>
          ) : (
            <>
              {/* List */}
              <div>
                {sections.length === 0 ? (
                  <p className="text-gray-600">No sections found for this program.</p>
                ) : (
                  sections.map((s) => (
                    <div key={s.id} className="mb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="text-lg font-medium text-gray-900">{s.title}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            type: <strong>{s.section_type}</strong> — order: {s.display_order ?? 0}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleExpand(s.id)}
                            className="px-3 py-1 rounded bg-white border hover:bg-gray-50 inline-flex items-center gap-2"
                            title="Toggle expanded (server-side)"
                          >
                            {localExpanded[s.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />} Toggle
                          </button>

                          <button
                            onClick={() => setOpenCurriculumFor(s)}
                            className="px-3 py-1 rounded bg-white border hover:bg-gray-50 inline-flex items-center gap-2"
                            title="Manage Curriculum (semesters & courses)"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z" /></svg>
                            Curriculum
                          </button>

                          <button
                            onClick={() => setOpenOutcomesFor(s)}
                            className="px-3 py-1 rounded bg-white border hover:bg-gray-50 inline-flex items-center gap-2"
                            title="Manage Outcomes"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m2 0a2 2 0 012 2v6H5v-6a2 2 0 012-2h10z" /></svg>
                            Outcomes
                          </button>

                          <button
                            onClick={() => setOpenContentFor(s)}
                            className="px-3 py-1 rounded bg-white border hover:bg-gray-50 inline-flex items-center gap-2"
                            title="Edit Section Content"
                          >
                            <Edit size={16} /> Content
                          </button>

                          <button onClick={() => openEdit(s)} className="px-3 py-1 rounded bg-white border hover:bg-gray-50 inline-flex items-center gap-2">
                            <Edit size={16} /> Edit
                          </button>

                          <button onClick={() => handleDelete(s.id)} className="px-3 py-1 rounded bg-red-600 text-white inline-flex items-center gap-2">
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </div>

                      {/* small preview of content if available */}
                      {s.content?.content_html ? (
                        <div className="mt-2 prose max-w-none" dangerouslySetInnerHTML={{ __html: (s.content.content_html.length > 500 ? s.content.content_html.slice(0, 500) + '...' : s.content.content_html) }} />
                      ) : null}

                      <hr className="my-4" />
                    </div>
                  ))
                )}
              </div>

              {/* Form (create/edit) */}
              {showForm && (
                <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-md border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title *</label>
                      <input
                        required
                        value={form.title}
                        onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                        className="mt-1 block w-full px-3 py-2 border rounded"
                        placeholder="e.g., Curriculum (2024)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Section Type *</label>
                      <select
                        required
                        value={form.section_type}
                        onChange={(e) => setForm((p) => ({ ...p, section_type: e.target.value }))}
                        className="mt-1 block w-full px-3 py-2 border rounded"
                      >
                        <option value="curriculum">curriculum</option>
                        <option value="info">info</option>
                        <option value="outcome">outcome</option>
                        <option value="overview">overview</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Display Order</label>
                      <input
                        type="number"
                        value={form.display_order}
                        onChange={(e) => setForm((p) => ({ ...p, display_order: e.target.value }))}
                        className="mt-1 block w-full px-3 py-2 border rounded"
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!form.is_expanded}
                          onChange={(e) => setForm((p) => ({ ...p, is_expanded: e.target.checked }))}
                        />
                        <span className="text-sm text-gray-700">Open by default (is_expanded)</span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      <Save size={16} /> {editing ? 'Update Section' : 'Create Section'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditing(null);
                      }}
                      className="inline-flex items-center gap-2 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals: Curriculum, Outcomes, Content Editor */}
      {openCurriculumFor && (
        <CurriculumManager
          section={openCurriculumFor}
          onClose={() => handleModalCloseAndRefresh()}
        />
      )}

      {openOutcomesFor && (
        <OutcomeManager
          section={openOutcomesFor}
          onClose={() => handleModalCloseAndRefresh()}
        />
      )}

      {openContentFor && (
        <SectionContentEditor
          section={openContentFor}
          onClose={() => handleModalCloseAndRefresh()}
        />
      )}
    </div>
  );
}
