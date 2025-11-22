export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3022';

// Add other config values as needed
export const config = {
  apiUrl: API_BASE_URL,
  imageUrl: `${API_BASE_URL}/uploads/images`,
  pdfUrl: `${API_BASE_URL}/uploads/pdfs`
};