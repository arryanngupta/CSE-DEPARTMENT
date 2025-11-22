// src/routes/public/public.routes.js (UPDATED)

import express from 'express';
import {
  getSliders,
  getPeople,
  getPrograms,
  getProgramDetails,
  getPersonBySlug,  // NEW
  getNews,
  getNewsById,
  getEvents,
  getAchievements,
  getNewsletters,
  getDirectory,
  getInfoBlock,
  getResearch,
  getResearchById,
  getFacilities,
  getFacilityById
} from '../../controllers/publicController.js';

const router = express.Router();

// Public routes
router.get('/sliders', getSliders);
router.get('/people', getPeople);
router.get('/people/:slug', getPersonBySlug);  // NEW - Faculty profile by slug
router.get('/programs', getPrograms);
router.get('/programs/:id', getProgramDetails);
router.get('/news', getNews);
router.get('/news/:id', getNewsById);
router.get('/events', getEvents);
router.get('/achievements', getAchievements);
router.get('/newsletters', getNewsletters);
router.get('/directory', getDirectory);
router.get('/info/:key', getInfoBlock);
router.get('/research', getResearch);
router.get('/research/:id', getResearchById);
router.get('/facilities', getFacilities);
router.get('/facilities/:id', getFacilityById);

export default router;