const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path; // For external URLs
  
  // Remove any double slashes that might occur
  return `${BASE_URL}${path}`.replace(/([^:]\/)\/+/g, "$1");
};

export const getPdfUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  // Remove any double slashes that might occur
  return `${BASE_URL}${path}`.replace(/([^:]\/)\/+/g, "$1");
};