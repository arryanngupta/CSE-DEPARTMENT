export function cleanProgram(raw) {
  if (!raw) return null;

  return {
    id: raw.id,
    name: raw.name,
    short_name: raw.short_name,
    level: raw.level,
    description: raw.description,
    overview: raw.overview,
    duration: raw.duration,
    total_credits: raw.total_credits,
    curriculum_pdf_path: raw.curriculum_pdf_path,

    sections: raw.sections?.map(section => ({
      id: section.id,
      title: section.title,
      section_type: section.section_type,
      is_expanded: section.is_expanded ?? false,
      display_order: section.display_order,

      content: section.content
        ? section.content.content_html
        : null,

      semesters: section.semesters?.map(sem => ({
        id: sem.id,
        semester_number: sem.semester_number,
        semester_name: sem.semester_name,
        courses: sem.courses || []
      })) || [],

      outcomes: section.outcomes || []
    })) || []
  };
}
