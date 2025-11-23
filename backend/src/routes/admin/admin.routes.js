// src/routes/admin/admin.routes.js
import express from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { login, getMe } from '../../controllers/authController.js';
import { uploadImage, uploadPDF } from '../../config/multer.js';
import { uploadLimiter } from '../../middleware/rateLimiter.js';
import {
  createSlider, updateSlider, deleteSlider, getAllSliders,
  createPerson, updatePerson, deletePerson, getAllPeople,
  createProgram, updateProgram, deleteProgram, getAllPrograms,
  getProgramSections, createProgramSection, updateProgramSection, deleteProgramSection,
  createCurriculumSemester, deleteCurriculumSemester, createCurriculumCourse,
  updateCurriculumCourse, deleteCurriculumCourse,
  createProgramOutcome, updateProgramOutcome,
  updateSectionContent,
  createNews, updateNews, deleteNews, getAllNews,
  createEvent, updateEvent, deleteEvent, getAllEvents,
  createAchievement, updateAchievement, deleteAchievement, getAllAchievements,
  createNewsletter, updateNewsletter, deleteNewsletter, getAllNewsletters,
  createDirectoryEntry, updateDirectoryEntry, deleteDirectoryEntry, getAllDirectoryEntries,
  createInfoBlock, updateInfoBlock, deleteInfoBlock, getAllInfoBlocks,
  getAllResearch, createResearch, updateResearch, deleteResearch,
  getAllFacilities, createFacility, updateFacility, deleteFacility
} from '../../controllers/adminController.js';

const router = express.Router();

/* ----------- PUBLIC ROUTES (no auth needed) ----------- */
router.post('/login', login);
router.get('/me', authenticate, getMe);

/* ----------- PROTECTED ROUTES -------------------------- */
router.use(authenticate);
router.use(requireAdmin);

// Sliders
router.get('/sliders', getAllSliders);
router.post('/sliders', uploadLimiter, uploadImage('image'), createSlider);
router.put('/sliders/:id', uploadLimiter, uploadImage('image'), updateSlider);
router.delete('/sliders/:id', deleteSlider);

// People
router.get('/people', getAllPeople);
router.post('/people', uploadLimiter, uploadImage('photo'), createPerson);
router.put('/people/:id', uploadLimiter, uploadImage('photo'), updatePerson);
router.delete('/people/:id', deletePerson);

// Programs
router.get('/programs', getAllPrograms);
router.post('/programs', uploadLimiter, uploadPDF('curriculum'), createProgram);
router.put('/programs/:id', uploadLimiter, uploadPDF('curriculum'), updateProgram);
router.delete('/programs/:id', deleteProgram);

// Program Sections
router.get('/programs/:id/sections', getProgramSections);
router.post('/programs/:id/sections', createProgramSection);
router.put('/programs/sections/:id', updateProgramSection);
router.delete('/programs/sections/:id', deleteProgramSection);

// Curriculum
router.post('/programs/sections/:id/semesters', createCurriculumSemester);
router.delete('/programs/semesters/:id', deleteCurriculumSemester);
router.post('/programs/semesters/:id/courses', createCurriculumCourse);
router.put('/programs/courses/:id', updateCurriculumCourse);
router.delete('/programs/courses/:id', deleteCurriculumCourse);

// Outcomes
router.post('/programs/sections/:id/outcomes', createProgramOutcome);
router.put('/programs/outcomes/:id', updateProgramOutcome);

// Section content
router.post('/programs/sections/content', updateSectionContent);

// News
router.get('/news', getAllNews);
router.post('/news', uploadLimiter, uploadImage('image'), createNews);
router.put('/news/:id', uploadLimiter, uploadImage('image'), updateNews);
router.delete('/news/:id', deleteNews);

// Events
router.get('/events', getAllEvents);
router.post('/events', uploadLimiter, uploadImage('banner'), createEvent);
router.put('/events/:id', uploadLimiter, uploadImage('banner'), updateEvent);
router.delete('/events/:id', deleteEvent);

// Achievements
router.get('/achievements', getAllAchievements);
router.post('/achievements', uploadLimiter, uploadImage('image'), createAchievement);
router.put('/achievements/:id', uploadLimiter, uploadImage('image'), updateAchievement);
router.delete('/achievements/:id', deleteAchievement);

// Newsletters
router.get('/newsletters', getAllNewsletters);
router.post('/newsletters', uploadLimiter, uploadPDF('pdf'), createNewsletter);
router.put('/newsletters/:id', uploadLimiter, uploadPDF('pdf'), updateNewsletter);
router.delete('/newsletters/:id', deleteNewsletter);

// Directory
router.get('/directory', getAllDirectoryEntries);
router.post('/directory', createDirectoryEntry);
router.put('/directory/:id', updateDirectoryEntry);
router.delete('/directory/:id', deleteDirectoryEntry);

// Info Blocks
router.get('/info-blocks', getAllInfoBlocks);
router.post('/info-blocks', uploadLimiter, uploadImage('media'), createInfoBlock);
router.put('/info-blocks/:id', uploadLimiter, uploadImage('media'), updateInfoBlock);
router.delete('/info-blocks/:id', deleteInfoBlock);

// Research
router.get('/research', getAllResearch);
router.post('/research', uploadLimiter, uploadImage('image'), createResearch);
router.put('/research/:id', uploadLimiter, uploadImage('image'), updateResearch);
router.delete('/research/:id', deleteResearch);

// Facilities
router.get('/facilities', getAllFacilities);
router.post('/facilities', uploadLimiter, uploadImage('image'), createFacility);
router.put('/facilities/:id', uploadLimiter, uploadImage('image'), updateFacility);
router.delete('/facilities/:id', deleteFacility);

export default router;
