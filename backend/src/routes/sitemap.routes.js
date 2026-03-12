import express from 'express';
import { People, Program, Research } from '../db/models/index.js';

const router = express.Router();

router.get('/sitemap.xml', async (req, res) => {
  try {
    const DOMAIN = process.env.SITE_DOMAIN || 'http://localhost:3022';

    const people = await People.findAll({
      attributes: ['slug', 'updatedAt']
    });

    const programs = await Program.findAll({
      attributes: ['id', 'updatedAt']
    });

    const research = await Research.findAll({
      attributes: ['id', 'updatedAt']
    });

    res.header('Content-Type', 'application/xml');

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Home
    xml += `
  <url>
    <loc>${DOMAIN}</loc>
    <priority>1.0</priority>
  </url>`;

    // Faculty
    people.forEach(p => {
      xml += `
  <url>
    <loc>${DOMAIN}/people/${p.slug}</loc>
    <lastmod>${p.updatedAt.toISOString()}</lastmod>
    <priority>0.8</priority>
  </url>`;
    });

    // Programs
    programs.forEach(p => {
      xml += `
  <url>
    <loc>${DOMAIN}/programs/${p.id}</loc>
    <lastmod>${p.updatedAt.toISOString()}</lastmod>
    <priority>0.7</priority>
  </url>`;
    });

    // Research
    research.forEach(r => {
      xml += `
  <url>
    <loc>${DOMAIN}/research/${r.id}</loc>
    <lastmod>${r.updatedAt.toISOString()}</lastmod>
    <priority>0.6</priority>
  </url>`;
    });

    xml += `
</urlset>`;

    res.send(xml);
  } catch (err) {
    console.error('Sitemap generation failed:', err);
    res.status(500).send('Error generating sitemap');
  }
});

export default router;
