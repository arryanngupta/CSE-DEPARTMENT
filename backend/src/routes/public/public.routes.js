// src/routes/public/public.routes.js (SEO UPDATED)

import express from 'express';
import {
  getSliders,
  getPeople,
  getPrograms,
  getProgramDetails,
  getPersonBySlug,
  getNews,
  getNewsById,
  getEvents,
  getEventById,
  getAchievements,
  getNewsletters,
  getDirectory,
  getInfoBlock,
  getResearch,
  getResearchById,
  getFacilities,
  getFacilityById
} from '../../controllers/publicController.js';

// 👉 IMPORT MODELS FOR SITEMAP
import { People, Program, Research } from '../../db/models/index.js';

const router = express.Router();

/* =========================
   EXISTING PUBLIC ROUTES
========================= */

router.get('/sliders', getSliders);
router.get('/people', getPeople);
router.get('/people/:slug', getPersonBySlug);
router.get('/programs', getPrograms);
router.get('/programs/:id', getProgramDetails);
router.get('/news', getNews);
router.get('/news/:id', getNewsById);
router.get('/events', getEvents);
router.get('/events/:id', getEventById);
router.get('/achievements', getAchievements);
router.get('/newsletters', getNewsletters);
router.get('/directory', getDirectory);
router.get('/info/:key', getInfoBlock);
router.get('/research', getResearch);
router.get('/research/:id', getResearchById);
router.get('/facilities', getFacilities);
router.get('/facilities/:id', getFacilityById);

/* =========================
   🔥 SEO SITEMAP ROUTE
========================= */

router.get('/sitemap.xml', async (req, res) => {
  try {
    const DOMAIN = process.env.SITE_DOMAIN || 'https://cse.lnmiit.ac.in';

    const people = await People.findAll({
      where: { is_active: true },
      attributes: ['slug', 'updatedAt']
    });

    const programs = await Program.findAll({
      where: { is_active: true },
      attributes: ['id', 'updatedAt']
    });

    const research = await Research.findAll({
      where: { is_active: true },
      attributes: ['id', 'updatedAt']
    });

    res.header('Content-Type', 'application/xml');

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Home
    sitemap += `
  <url>
    <loc>${DOMAIN}</loc>
    <priority>1.0</priority>
  </url>`;

    // Faculty profiles
    people.forEach(person => {
      sitemap += `
  <url>
    <loc>${DOMAIN}/people/${person.slug}</loc>
    <lastmod>${person.updatedAt.toISOString()}</lastmod>
    <priority>0.8</priority>
  </url>`;
    });

    // Programs
    programs.forEach(program => {
      sitemap += `
  <url>
    <loc>${DOMAIN}/programs/${program.id}</loc>
    <lastmod>${program.updatedAt.toISOString()}</lastmod>
    <priority>0.7</priority>
  </url>`;
    });

    // Research
    research.forEach(item => {
      sitemap += `
  <url>
    <loc>${DOMAIN}/research/${item.id}</loc>
    <lastmod>${item.updatedAt.toISOString()}</lastmod>
    <priority>0.6</priority>
  </url>`;
    });

    sitemap += `
</urlset>`;

    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

export default router;
