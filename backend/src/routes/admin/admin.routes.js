// src/routes/admin/admin.routes.js
import express from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { upload } from '../../config/multer.js';
import { uploadLimiter } from '../../middleware/rateLimiter.js';
import {
  // Sliders
  createSlider,
  updateSlider,
  deleteSlider,
  getAllSliders,
  
  // People
  createPerson,
  updatePerson,
  deletePerson,
  getAllPeople,
  
  // Programs
  createProgram,
  updateProgram,
  deleteProgram,
  getAllPrograms,
  
  // Program Sections
  createProgramSection,
  updateProgramSection,
  deleteProgramSection,
  getProgramSections,
  
  // Curriculum
  createCurriculumSemester,
  createCurriculumCourse,
  updateCurriculumCourse,
  deleteCurriculumCourse,
  
  // Outcomes
  createProgramOutcome,
  updateProgramOutcome,
  
  // Section Content
  updateSectionContent,
  
  // News
  createNews,
  updateNews,
  deleteNews,
  getAllNews,
  
  // Events
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
  
  // Achievements
  createAchievement,
  updateAchievement,
  deleteAchievement,
  getAllAchievements,
  
  // Newsletters
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
  getAllNewsletters,
  
  // Directory
  createDirectoryEntry,
  updateDirectoryEntry,
  deleteDirectoryEntry,
  getAllDirectoryEntries,
  
  // Info Blocks
  createInfoBlock,
  updateInfoBlock,
  deleteInfoBlock,
  getAllInfoBlocks,

  // Research
  getAllResearch, 
  createResearch, 
  updateResearch, 
  deleteResearch,

  // Facilities
  getAllFacilities, 
  createFacility, 
  updateFacility, 
  deleteFacility
} from '../../controllers/adminController.js';

const router = express.Router();

// Apply authentication middleware to all admin routes
router.use(authenticate);
router.use(requireAdmin);

// Sliders
router.get('/sliders', getAllSliders);
router.post('/sliders', uploadLimiter, upload.single('image'), createSlider);
router.put('/sliders/:id', uploadLimiter, upload.single('image'), updateSlider);
router.delete('/sliders/:id', deleteSlider);

// People
router.get('/people', getAllPeople);
router.post('/people', uploadLimiter, upload.single('photo'), createPerson);
router.put('/people/:id', uploadLimiter, upload.single('photo'), updatePerson);
router.delete('/people/:id', deletePerson);

// Programs
router.get('/programs', getAllPrograms);
router.post('/programs', uploadLimiter, upload.single('curriculum'), createProgram);
router.put('/programs/:id', uploadLimiter, upload.single('curriculum'), updateProgram);
router.delete('/programs/:id', deleteProgram);

// Program Sections
router.get('/programs/:id/sections', getProgramSections); // <-- new GET endpoint
router.post('/programs/:id/sections', createProgramSection);
router.put('/programs/sections/:id', updateProgramSection);
router.delete('/programs/sections/:id', deleteProgramSection);

// Curriculum
router.post('/programs/sections/:id/semesters', createCurriculumSemester);
router.post('/programs/semesters/:id/courses', createCurriculumCourse);
router.put('/programs/courses/:id', updateCurriculumCourse);
router.delete('/programs/courses/:id', deleteCurriculumCourse);

// Outcomes
router.post('/programs/sections/:id/outcomes', createProgramOutcome);
router.put('/programs/outcomes/:id', updateProgramOutcome);

// Section Content
router.post('/programs/sections/content', updateSectionContent);

// News
router.get('/news', getAllNews);
router.post('/news', uploadLimiter, upload.single('image'), createNews);
router.put('/news/:id', uploadLimiter, upload.single('image'), updateNews);
router.delete('/news/:id', deleteNews);

// Events
router.get('/events', getAllEvents);
router.post('/events', uploadLimiter, upload.single('banner'), createEvent);
router.put('/events/:id', uploadLimiter, upload.single('banner'), updateEvent);
router.delete('/events/:id', deleteEvent);

// Achievements
router.get('/achievements', getAllAchievements);
router.post('/achievements', uploadLimiter, upload.single('image'), createAchievement);
router.put('/achievements/:id', uploadLimiter, upload.single('image'), updateAchievement);
router.delete('/achievements/:id', deleteAchievement);

// Newsletters
router.get('/newsletters', getAllNewsletters);
router.post('/newsletters', uploadLimiter, upload.single('pdf'), createNewsletter);
router.put('/newsletters/:id', uploadLimiter, upload.single('pdf'), updateNewsletter);
router.delete('/newsletters/:id', deleteNewsletter);

// Directory
router.get('/directory', getAllDirectoryEntries);
router.post('/directory', createDirectoryEntry);
router.put('/directory/:id', updateDirectoryEntry);
router.delete('/directory/:id', deleteDirectoryEntry);

// Info Blocks
router.get('/info-blocks', getAllInfoBlocks);
router.post('/info-blocks', uploadLimiter, upload.single('media'), createInfoBlock);
router.put('/info-blocks/:id', uploadLimiter, upload.single('media'), updateInfoBlock);
router.delete('/info-blocks/:id', deleteInfoBlock);

// ---------------- RESEARCH ----------------
router.get('/research', getAllResearch);
router.post('/research', uploadLimiter, upload.single('image'), createResearch);
router.put('/research/:id', uploadLimiter, upload.single('image'), updateResearch);
router.delete('/research/:id', deleteResearch);

// ---------------- FACILITIES ----------------
router.get('/facilities', getAllFacilities);
router.post('/facilities', uploadLimiter, upload.single('image'), createFacility);
router.put('/facilities/:id', uploadLimiter, upload.single('image'), updateFacility);
router.delete('/facilities/:id', deleteFacility);

export default router;