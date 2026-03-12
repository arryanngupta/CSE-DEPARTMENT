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

// 🔥 NEW: Faculty profile normalizer
import { normalizeFacultyProfile } from '../utils/normalizeFacultyProfile.js';

/**
 * Public controllers for the website.
 */

/* ======================= SLIDERS ======================= */
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

/* ======================= PEOPLE LIST ======================= */
export const getPeople = async (req, res, next) => {
  try {
    const { designation,person_type, area, q, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};

    if (designation) where.designation = { [Op.like]: `%${designation}%` };
    if (person_type) where.person_type = person_type;
    if (area) where.research_areas = { [Op.like]: `%${area}%` };

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

/* ======================= FACULTY PROFILE ======================= */
/**
 * GET /api/public/people/:slug
 * LNMIIT-style Faculty Profile API
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
        'summary',
        'photo_path',
        'research_areas',
        'bio',
        'joining_date',
        'department',
        'education',
        'publications',
        'workshops',
        'profile_sections'
      ]
    });

    if (!person) {
      return res.status(404).json({ error: 'Faculty member not found' });
    }

    // NORMALIZE to frontend-ready LNMIIT schema
    const profile = normalizeFacultyProfile(person);

    res.json({ data: profile });
  } catch (error) {
    next(error);
  }
};

/* ======================= PROGRAMS ======================= */
export const getPrograms = async (req, res, next) => {
  try {
    const programs = await Program.findAll({
      order: [
        ['level', 'ASC'],
        ['display_order', 'ASC'],
        ['name', 'ASC']
      ],
      attributes: [
        'id',
        'name',
        'short_name',
        'level',
        'description',
        'overview',
        'duration',
        'total_credits',
        'curriculum_pdf_path'
      ]
    });

    res.json({ data: programs });
  } catch (error) {
    next(error);
  }
};

/* ======================= PROGRAM DETAILS ======================= */
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
      sections: (program.sections || []).map(s => ({
        id: s.id,
        title: s.title,
        section_type: s.section_type,
        display_order: s.display_order,
        is_expanded: !!s.is_expanded,
        content: s.content ? s.content.content_html : null,
        outcomes: s.outcomes || [],
        semesters: s.semesters || []
      }))
    };

    res.json({ data: cleanProgram });
  } catch (error) {
    next(error);
  }
};

/* ======================= NEWS / EVENTS / OTHERS ======================= */

export const getNews = async (req, res, next) => {
  try {
    const { published = '1', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = published === '1' ? { isPublished: true } : {};

    const { count, rows } = await News.findAndCountAll({
      where,
      order: [['date', 'DESC']],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    });

    res.json({ data: rows, meta: { total: count } });
  } catch (error) {
    next(error);
  }
};

export const getNewsById = async (req, res, next) => {
  try {
    const news = await News.findOne({
      where: { id: req.params.id, isPublished: true }
    });

    if (!news) return res.status(404).json({ error: 'News not found' });
    res.json({ data: news });
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 6 } = req.query;
    const offset = (page - 1) * limit;

    const where = { isPublished: true };

    if (q) {
      where[Op.or] = [
        { title: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } }
      ];
    }

    const { count, rows } = await Event.findAndCountAll({
      where,
      order: [["startsAt", "DESC"]],
      limit: +limit,
      offset
    });

    res.json({
      data: rows,
      meta: {
        total: count,
        page: +page,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (e) {
    next(e);
  }
};

export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findOne({
      where: {
        id: req.params.id,
        isPublished: true,
      },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ data: event });
  } catch (error) {
    next(error);
  }
};

export const getAchievements = async (req, res, next) => {
  try {
    const { category } = req.query;

    const where = { isPublished: true };
    if (category) where.category = category;

    const achievements = await Achievement.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    res.json({ data: achievements });
  } catch (error) {
    next(error);
  }
};


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

export const getInfoBlock = async (req, res, next) => {
  try {
    const infoBlock = await InfoBlock.findOne({
      where: { key: req.params.key }
    });

    if (!infoBlock) return res.status(404).json({ error: 'Info block not found' });
    res.json({ data: infoBlock });
  } catch (error) {
    next(error);
  }
};

export const getResearch = async (req, res, next) => {
  try {
    const research = await Research.findAll({
      order: [['display_order', 'ASC']]
    });

    res.json({ data: research });
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

export const getFacilities = async (req, res, next) => {
  try {
    const facilities = await Facility.findAll({
      where: { is_active: true },
      order: [['display_order', 'ASC']]
    });

    res.json({ data: facilities });
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
