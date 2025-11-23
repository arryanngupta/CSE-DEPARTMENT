export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path; // cloudinary
  return `${BASE_URL}${path}`.replace(/([^:]\/)\/+/g, "$1");
};

export const getPdfUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path}`.replace(/([^:]\/)\/+/g, "$1");
};
