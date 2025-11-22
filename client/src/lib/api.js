// src/lib/api.js
import axios from 'axios';

// Base URLs (env pref) ------------------------------------------------------
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3022';
const API_BASE_URL = `${BASE_URL}/api`;

// Axios instance -------------------------------------------------------------
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000, // 15s
});

// Attach auth token to requests if present -----------------------------------
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (e) {
      // ignore localStorage read errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response interceptor (handle 401 -> redirect to admin login) ------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      try {
        localStorage.removeItem('token');
      } catch (e) {}
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// ========================
// AUTH APIs (named export)
// ========================
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
};

// ========================
// PUBLIC APIs (named export)
// ========================
export const publicAPI = {
  getSliders: (params) => api.get('/sliders', { params }),
  getPeople: (params) => api.get('/people', { params }),
  getPersonBySlug: (slug) => api.get(`/people/${encodeURIComponent(slug)}`),
  getPrograms: (params) => api.get('/programs', { params }),
  getProgramDetails: (id) => api.get(`/programs/${id}`),
  getNews: (params) => api.get('/news', { params }),
  getNewsById: (id) => api.get(`/news/${id}`),
  getEvents: (params) => api.get('/events', { params }),
  getAchievements: (params) => api.get('/achievements', { params }),
  getNewsletters: (params) => api.get('/newsletters', { params }),
  getDirectory: () => api.get('/directory'),
  getInfoBlock: (key) => api.get(`/info/${encodeURIComponent(key)}`),
  getResearch: (params) => api.get('/research', { params }),
  getFacilities: (params) => api.get('/facilities', { params }),
};

// ========================
// ADMIN APIs (named export)
// ========================
export const adminAPI = {
  // Sliders
  getSliders: (params) => api.get('/admin/sliders', { params }),
  createSlider: (formData) =>
    api.post('/admin/sliders', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateSlider: (id, formData) =>
    api.put(`/admin/sliders/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteSlider: (id) => api.delete(`/admin/sliders/${id}`),

  // People
  getPeople: (params) => api.get('/admin/people', { params }),
  createPerson: (formData) =>
    api.post('/admin/people', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updatePerson: (id, formData) =>
    api.put(`/admin/people/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deletePerson: (id) => api.delete(`/admin/people/${id}`),

  // Programs
  getPrograms: () => api.get('/admin/programs'),
  createProgram: (formData) =>
    api.post('/admin/programs', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateProgram: (id, formData) =>
    api.put(`/admin/programs/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteProgram: (id) => api.delete(`/admin/programs/${id}`),

  // Program Sections (admin)
  getProgramSections: (programId) => api.get(`/admin/programs/${programId}/sections`),
  createProgramSection: (programId, data) => api.post(`/admin/programs/${programId}/sections`, data),
  updateProgramSection: (sectionId, data) => api.put(`/admin/programs/sections/${sectionId}`, data),
  deleteProgramSection: (sectionId) => api.delete(`/admin/programs/sections/${sectionId}`),

  // Curriculum (semesters & courses)
  createSemester: (sectionId, data) => api.post(`/admin/programs/sections/${sectionId}/semesters`, data),
  deleteSemester: (semesterId) => api.delete(`/admin/programs/semesters/${semesterId}`),
  createCourse: (semesterId, data) => api.post(`/admin/programs/semesters/${semesterId}/courses`, data),
  updateCourse: (courseId, data) => api.put(`/admin/programs/courses/${courseId}`, data),
  deleteCourse: (courseId) => api.delete(`/admin/programs/courses/${courseId}`),

  // Outcomes
  createOutcome: (sectionId, data) => api.post(`/admin/programs/sections/${sectionId}/outcomes`, data),
  updateOutcome: (outcomeId, data) => api.put(`/admin/programs/outcomes/${outcomeId}`, data),
  deleteOutcome: (outcomeId) => api.delete(`/admin/programs/outcomes/${outcomeId}`),

  // Section content (overview/info)
  saveSectionContent: (data) => api.post(`/admin/programs/sections/content`, data),
  getProgramDetailsAdmin: (programId) => api.get(`/admin/programs/${programId}`),

  // News
  getNews: () => api.get('/admin/news'),
  createNews: (formData) =>
    api.post('/admin/news', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateNews: (id, formData) =>
    api.put(`/admin/news/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteNews: (id) => api.delete(`/admin/news/${id}`),

  // Events
  getEvents: () => api.get('/admin/events'),
  createEvent: (formData) =>
    api.post('/admin/events', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateEvent: (id, formData) =>
    api.put(`/admin/events/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteEvent: (id) => api.delete(`/admin/events/${id}`),

  // Achievements
  getAchievements: () => api.get('/admin/achievements'),
  createAchievement: (formData) =>
    api.post('/admin/achievements', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateAchievement: (id, formData) =>
    api.put(`/admin/achievements/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteAchievement: (id) => api.delete(`/admin/achievements/${id}`),

  // Newsletters
  getNewsletters: () => api.get('/admin/newsletters'),
  createNewsletter: (formData) =>
    api.post('/admin/newsletters', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateNewsletter: (id, formData) =>
    api.put(`/admin/newsletters/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteNewsletter: (id) => api.delete(`/admin/newsletters/${id}`),

  // Directory
  getDirectory: () => api.get('/admin/directory'),
  createDirectoryEntry: (data) => api.post('/admin/directory', data),
  updateDirectoryEntry: (id, data) => api.put(`/admin/directory/${id}`, data),
  deleteDirectoryEntry: (id) => api.delete(`/admin/directory/${id}`),

  // Info Blocks
  getInfoBlocks: () => api.get('/admin/info-blocks'),
  createInfoBlock: (formData) =>
    api.post('/admin/info-blocks', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateInfoBlock: (id, formData) =>
    api.put(`/admin/info-blocks/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteInfoBlock: (id) => api.delete(`/admin/info-blocks/${id}`),

  // Research
  getResearch: () => api.get('/admin/research'),
  createResearch: (formData) =>
    api.post('/admin/research', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateResearch: (id, formData) =>
    api.put(`/admin/research/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteResearch: (id) => api.delete(`/admin/research/${id}`),

  // Facilities
  getFacilities: () => api.get('/admin/facilities'),
  createFacility: (formData) =>
    api.post('/admin/facilities', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateFacility: (id, formData) =>
    api.put(`/admin/facilities/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteFacility: (id) => api.delete(`/admin/facilities/${id}`),
};

// default export for existing default-import usages --------------------------------
export default api;