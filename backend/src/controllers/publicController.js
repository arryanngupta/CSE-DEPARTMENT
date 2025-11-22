// src/controllers/publicController.js

import { Op } from 'sequelize';
import {
  Slider,
  People,
  Program,
  News,
  Event,
  Achievement,
  Newsletter,
  DirectoryEntry,
  InfoBlock,
  Research,
  Facility,
  ProgramSection,
  CurriculumSemester,
  CurriculumCourse,
  ProgramOutcome,
  SectionContent
} from '../db/models/index.js';

/**
 * Public controllers for the website.
 */

// GET /api/public/sliders
export const getSliders = async (req, res, next) => {
  try {
    const sliders = await Slider.findAll({
      where: { isActive: true },
      order: [['order', 'ASC']],
      attributes: ['id', 'image_path', 'caption', 'order']
    });

    res.json({ data: sliders });
  } catch (error) {
    next(error);
  }
};

// GET /api/public/people
export const getPeople = async (req, res, next) => {
  try {
    const { designation, area, q, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};

    if (designation) {
      where.designation = { [Op.like]: `%${designation}%` };
    }

    if (area) {
      where.research_areas = { [Op.like]: `%${area}%` };
    }

    if (q) {
      where[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },
        { designation: { [Op.like]: `%${q}%` } },
        { research_areas: { [Op.like]: `%${q}%` } }
      ];
    }

    const { count, rows } = await People.findAndCountAll({
      where,
      order: [['order', 'ASC'], ['name', 'ASC']],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    });

    res.json({
      data: rows,
      meta: {
        total: count,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/public/people/:slug
 * Retrieve a single faculty member by slug for profile page
 */
export const getPersonBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const person = await People.findOne({
      where: { slug },
      attributes: [
        'id',
        'name',
        'slug',
        'designation',
        'email',
        'phone',
        'webpage',
        'photo_path',
        'research_areas',
        'bio',
        'joining_date',
        'department',
        'education',
        'publications',
        'workshops',
        'order'
      ]
    });

    if (!person) {
      return res.status(404).json({ error: 'Faculty member not found' });
    }

    // Clean and normalise response
    const cleanPerson = {
      id: person.id,
      name: person.name,
      slug: person.slug,
      designation: person.designation,
      email: person.email,
      phone: person.phone,
      webpage: person.webpage,
      photo_path: person.photo_path,
      research_areas: person.research_areas,
      bio: person.bio,
      joining_date: person.joining_date,
      department: person.department,
      education: person.education || [],
      publications: person.publications || [],
      workshops: person.workshops || []
    };

    res.json({ data: cleanPerson });
  } catch (error) {
    next(error);
  }
};

// GET /api/public/programs
export const getPrograms = async (req, res, next) => {
  try {
    const programs = await Program.findAll({
      order: [
        ['level', 'ASC'],
        ['display_order', 'ASC'],
        ['name', 'ASC']
      ],
      attributes: ['id', 'name', 'short_name', 'level', 'description', 'overview', 'duration', 'total_credits', 'curriculum_pdf_path']
    });

    res.json({ data: programs });
  } catch (error) {
    next(error);
  }
};

// GET /api/public/programs/:id
export const getProgramDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const program = await Program.findByPk(id, {
      include: [
        {
          model: ProgramSection,
          as: 'sections',
          separate: true,
          order: [['display_order', 'ASC']],
          include: [
            {
              model: CurriculumSemester,
              as: 'semesters',
              separate: true,
              order: [['display_order', 'ASC']],
              include: [
                {
                  model: CurriculumCourse,
                  as: 'courses',
                  separate: true,
                  order: [['display_order', 'ASC']]
                }
              ]
            },
            {
              model: ProgramOutcome,
              as: 'outcomes',
              separate: true,
              order: [['display_order', 'ASC']]
            },
            {
              model: SectionContent,
              as: 'content'
            }
          ]
        }
      ]
    });

    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    // CLEAN SERIALIZER - produce a lightweight JSON suitable for frontend
    const cleanProgram = {
      id: program.id,
      name: program.name,
      short_name: program.short_name,
      level: program.level,
      description: program.description,
      overview: program.overview,
      duration: program.duration,
      total_credits: program.total_credits,
      curriculum_pdf_path: program.curriculum_pdf_path,
      sections: (program.sections || [])
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
        .map((s) => ({
          id: s.id,
          title: s.title,
          section_type: s.section_type,
          display_order: s.display_order,
          is_expanded: !!s.is_expanded,
          content: s.content ? { id: s.content.id, content_html: s.content.content_html } : null,
          outcomes: (s.outcomes || [])
            .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
            .map((o) => ({
              id: o.id,
              outcome_code: o.outcome_code,
              outcome_text: o.outcome_text,
              display_order: o.display_order
            })),
          semesters: (s.semesters || [])
            .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
            .map((sem) => ({
              id: sem.id,
              semester_number: sem.semester_number,
              semester_name: sem.semester_name,
              display_order: sem.display_order,
              courses: (sem.courses || [])
                .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                .map((c) => ({
                  id: c.id,
                  course_name: c.course_name,
                  course_type: c.course_type,
                  theory_hours: c.theory_hours,
                  lab_hours: c.lab_hours,
                  tutorial_hours: c.tutorial_hours,
                  practical_hours: c.practical_hours,
                  credits: c.credits,
                  display_order: c.display_order
                }))
            }))
        }))
    };

    return res.json({ data: cleanProgram });
  } catch (error) {
    next(error);
  }
};

// GET /api/public/news
export const getNews = async (req, res, next) => {
  try {
    const { published = '1', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (published === '1') {
      where.isPublished = true;
    }

    const { count, rows } = await News.findAndCountAll({
      where,
      order: [['date', 'DESC']],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    });

    res.json({
      data: rows,
      meta: {
        total: count,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/public/news/:id
export const getNewsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const news = await News.findOne({
      where: { id, isPublished: true }
    });

    if (!news) {
      return res.status(404).json({ error: 'News not found' });
    }

    res.json({ data: news });
  } catch (error) {
    next(error);
  }
};

// GET /api/public/events
export const getEvents = async (req, res, next) => {
  try {
    const { upcoming = '1', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = { isPublished: true };

    if (upcoming === '1') {
      where.startsAt = { [Op.gte]: new Date() };
    }

    const { count, rows } = await Event.findAndCountAll({
      where,
      order: [['startsAt', upcoming === '1' ? 'ASC' : 'DESC']],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    });

    res.json({
      data: rows,
      meta: {
        total: count,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/public/achievements
export const getAchievements = async (req, res, next) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Achievement.findAndCountAll({
      where: { isPublished: true },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    });

    res.json({
      data: rows,
      meta: {
        total: count,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/public/newsletters
export const getNewsletters = async (req, res, next) => {
  try {
    const newsletters = await Newsletter.findAll({
      order: [['issueDate', 'DESC']]
    });

    res.json({ data: newsletters });
  } catch (error) {
    next(error);
  }
};

// GET /api/public/directory
export const getDirectory = async (req, res, next) => {
  try {
    const directory = await DirectoryEntry.findAll({
      order: [['name', 'ASC']]
    });

    res.json({ data: directory });
  } catch (error) {
    next(error);
  }
};

// GET /api/public/info/:key
export const getInfoBlock = async (req, res, next) => {
  try {
    const { key } = req.params;
    const infoBlock = await InfoBlock.findOne({
      where: { key }
    });

    if (!infoBlock) {
      return res.status(404).json({ error: 'Info block not found' });
    }

    res.json({ data: infoBlock });
  } catch (error) {
    next(error);
  }
};

// RESEARCH (public)
export const getResearch = async (req, res, next) => {
  try {
    const { category, featured = '0', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (category) where.category = category;
    if (featured === '1') where.is_featured = true;

    const { count, rows } = await Research.findAndCountAll({
      where,
      order: [['display_order', 'ASC']],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    });

    res.json({
      data: rows,
      meta: {
        total: count,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getResearchById = async (req, res, next) => {
  try {
    const research = await Research.findByPk(req.params.id);
    if (!research) return res.status(404).json({ error: 'Research not found' });
    res.json({ data: research });
  } catch (error) {
    next(error);
  }
};

// FACILITIES (public)
export const getFacilities = async (req, res, next) => {
  try {
    const { category, active = '1', page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (category) where.category = category;
    if (active === '1') where.is_active = true;

    const { count, rows } = await Facility.findAndCountAll({
      where,
      order: [['display_order', 'ASC']],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    });

    res.json({
      data: rows,
      meta: {
        total: count,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getFacilityById = async (req, res, next) => {
  try {
    const facility = await Facility.findByPk(req.params.id);
    if (!facility) return res.status(404).json({ error: 'Facility not found' });
    res.json({ data: facility });
  } catch (error) {
    next(error);
  }
};
