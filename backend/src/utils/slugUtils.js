// src/utils/slugUtils.js

/**
 * Generate a URL-friendly slug from a name
 * Example: "Sunil Kumar" -> "sunil-kumar"
 */
export const generateSlug = (name) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
};

/**
 * Auto-generate slug on model creation/update
 * Usage in controller: person.slug = generateSlug(person.name);
 */
export const ensureSlug = (person) => {
  if (!person.slug && person.name) {
    person.slug = generateSlug(person.name);
  }
  return person;
};