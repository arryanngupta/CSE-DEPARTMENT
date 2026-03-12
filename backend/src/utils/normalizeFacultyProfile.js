// backend/src/utils/normalizeFacultyProfile.js

export function normalizeFacultyProfile(person) {
  const sections = [];

  /* ================= PERSONAL INFORMATION (FIXED) ================= */
  sections.push({
    title: "Personal Information",
    type: "table",
    columns: ["Field", "Details"],
    data: [
      ["Name", person.name || "—"],
      ["Designation", person.designation || "—"],
      ["Department", person.department || "—"],
      ["Email", person.email || "—"],
      ["Phone", person.phone || "—"]
    ],
  });

  /* ================= ADMIN-CONTROLLED SECTIONS =================
     ONLY use profile_sections from DB
     No auto-generation
  =============================================================== */
  if (Array.isArray(person.profile_sections)) {
  person.profile_sections.forEach((section) => {
    if (!section?.title || !section?.type) return;

    sections.push({
      title: section.title,
      type: section.type,
      columns: section.columns || [],
      data:
        section.data ??
        section.items ??      // 🔥 THIS WAS MISSING
        section.content ??
        ""
    });
  });
}

  return {
    /* ================= LEFT SIDEBAR ================= */
    name: person.name,
    designation: person.designation,
    department: person.department,
    email: person.email,
    phone: person.phone,
    website: person.webpage,
    photo: person.photo_path,
    joining_date: person.joining_date,

    /* ================= RIGHT CONTENT ================= */
    summary: person.summary || "",
    biography: person.bio || "",
    research_area: person.research_areas || "",

    /* ================= PROFILE CONTENT ================= */
    sections,
  };
}
