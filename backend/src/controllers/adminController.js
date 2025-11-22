// src/controllers/adminController.js
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
import { Op } from "sequelize";
import { deleteFile } from '../services/fileService.js';
import { generateSlug } from '../utils/slugUtils.js';

/**
 * Helper: parse booleans sent as "true"/"false" or real booleans or missing.
 * If value is undefined, returns undefined (caller can decide default).
 */
const parseBool = (v) => {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') {
    if (v.toLowerCase() === 'false') return false;
    if (v.toLowerCase() === 'true') return true;
  }
  return v === undefined ? undefined : Boolean(v);
};

/* ==========================
   SLIDERS
   ========================== */
export const getAllSliders = async (req, res, next) => {
  try {
    const sliders = await Slider.findAll({ order: [['order', 'ASC']] });
    res.json({ data: sliders });
  } catch (error) { next(error); }
};

export const createSlider = async (req, res, next) => {
  try {
    const { caption } = req.body;
    const order = Number(req.body.order) || 0;
    const isActive = parseBool(req.body.isActive);
    if (!req.file) return res.status(400).json({ error: 'Image is required' });

    const slider = await Slider.create({
      image_path: `/uploads/images/${req.file.filename}`,
      caption,
      order,
      isActive: isActive === undefined ? true : isActive
    });

    res.status(201).json({ data: slider });
  } catch (error) { next(error); }
};

export const updateSlider = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { caption } = req.body;
    const order = req.body.order !== undefined ? Number(req.body.order) : undefined;
    const isActive = parseBool(req.body.isActive);

    const slider = await Slider.findByPk(id);
    if (!slider) return res.status(404).json({ error: 'Slider not found' });

    const updateData = {};
    if (caption !== undefined) updateData.caption = caption;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    if (req.file) {
      if (slider.image_path) deleteFile(slider.image_path);
      updateData.image_path = `/uploads/images/${req.file.filename}`;
    }

    await slider.update(updateData);
    res.json({ data: slider });
  } catch (error) { next(error); }
};

export const deleteSlider = async (req, res, next) => {
  try {
    const { id } = req.params;
    const slider = await Slider.findByPk(id);
    if (!slider) return res.status(404).json({ error: 'Slider not found' });

    if (slider.image_path) deleteFile(slider.image_path);
    await slider.destroy();

    res.json({ data: { message: 'Slider deleted successfully' } });
  } catch (error) { next(error); }
};

/* ==========================
   PEOPLE (UPDATED)
   ========================== */
export const getAllPeople = async (req, res, next) => {
  try {
    const people = await People.findAll({ 
      order: [['order', 'ASC'], ['name', 'ASC']] 
    });
    res.json({ data: people });
  } catch (error) { next(error); }
};

export const createPerson = async (req, res, next) => {
  try {
    const {
      name,
      designation,
      email,
      phone,
      webpage,
      research_areas,
      bio,
      joining_date,
      department,
      education,
      publications,
      workshops
    } = req.body;

    const order = Number(req.body.order) || 0;

    // Generate slug from name
    let slug = generateSlug(name);

    // Ensure unique slug
    let exists = await People.findOne({ where: { slug } });
    let counter = 1;
    while (exists) {
      slug = `${generateSlug(name)}-${counter++}`;
      exists = await People.findOne({ where: { slug } });
    }

    const person = await People.create({
      name,
      slug,
      designation,
      email,
      phone,
      webpage,
      research_areas,
      bio,

      // 🔥 FIXED: "Invalid date" bug
      joining_date: joining_date ? new Date(joining_date) : null,

      department: department || "Computer Science & Engineering",

      education: education ? JSON.parse(education) : [],
      publications: publications ? JSON.parse(publications) : [],
      workshops: workshops ? JSON.parse(workshops) : [],

      photo_path: req.file ? `/uploads/images/${req.file.filename}` : null,
      order
    });

    return res.status(201).json({
      success: true,
      message: "Person created successfully",
      data: person
    });
  } catch (err) {
    next(err);
  }
};



export const updatePerson = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      name,
      designation,
      email,
      phone,
      webpage,
      research_areas,
      bio,
      joining_date,
      department,
      education,
      publications,
      workshops
    } = req.body;

    const order =
      req.body.order !== undefined ? Number(req.body.order) : undefined;

    const person = await People.findByPk(id);
    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }

    const updateData = {};

    /* ===============================
       HANDLE NAME + SLUG UPDATE
       =============================== */
    if (name !== undefined) {
      updateData.name = name;

      if (name !== person.name) {
        let newSlug = generateSlug(name);

        let exists = await People.findOne({
          where: {
            slug: newSlug,
            id: { [Op.ne]: id }
          }
        });

        let counter = 1;
        while (exists) {
          newSlug = `${generateSlug(name)}-${counter++}`;
          exists = await People.findOne({
            where: {
              slug: newSlug,
              id: { [Op.ne]: id }
            }
          });
        }

        updateData.slug = newSlug;
      }
    }

    /* ===============================
       NORMAL FIELDS
       =============================== */
    if (designation !== undefined) updateData.designation = designation;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (webpage !== undefined) updateData.webpage = webpage;
    if (research_areas !== undefined) updateData.research_areas = research_areas;
    if (bio !== undefined) updateData.bio = bio;

    // 🔥 FIXED: Turns empty date into NULL instead of "Invalid date"
    if (joining_date !== undefined)
      updateData.joining_date = joining_date ? new Date(joining_date) : null;

    if (department !== undefined)
      updateData.department = department || "Computer Science & Engineering";

    /* ===============================
       JSON FIELDS
       =============================== */
    if (education !== undefined)
      updateData.education = education ? JSON.parse(education) : [];

    if (publications !== undefined)
      updateData.publications = publications ? JSON.parse(publications) : [];

    if (workshops !== undefined)
      updateData.workshops = workshops ? JSON.parse(workshops) : [];

    if (order !== undefined) updateData.order = order;

    /* ===============================
       HANDLE IMAGE UPDATE
       =============================== */
    if (req.file) {
      if (person.photo_path) deleteFile(person.photo_path);

      updateData.photo_path = `/uploads/images/${req.file.filename}`;
    }

    await person.update(updateData);

    return res.json({
      success: true,
      message: "Person updated successfully",
      data: person
    });
  } catch (error) {
    next(error);
  }
};

export const deletePerson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const person = await People.findByPk(id);
    if (!person) return res.status(404).json({ error: 'Person not found' });

    if (person.photo_path) deleteFile(person.photo_path);
    await person.destroy();

    res.json({ data: { message: 'Person deleted successfully' } });
  } catch (error) { next(error); }
};

/* ==========================
   PROGRAMS + SECTIONS + OUTCOMES + SECTION CONTENT
   ========================== */
export const getAllPrograms = async (req, res, next) => {
  try {
    const programs = await Program.findAll({
      order: [['level', 'ASC'], ['display_order', 'ASC'], ['name', 'ASC']],
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
            { model: ProgramOutcome, as: 'outcomes', separate: true, order: [['display_order', 'ASC']] },
            { model: SectionContent, as: 'content' }
          ]
        }
      ]
    });

    res.json({ data: programs });
  } catch (error) { next(error); }
};

export const createProgram = async (req, res, next) => {
  try {
    const {
      name,
      short_name,
      level,
      description,
      overview,
      duration,
      total_credits
    } = req.body;
    const display_order = Number(req.body.display_order) || 0;

    const program = await Program.create({
      name,
      short_name,
      level,
      description,
      overview,
      duration,
      total_credits,
      display_order,
      curriculum_pdf_path: req.file ? `/uploads/pdfs/${req.file.filename}` : null
    });

    res.status(201).json({ data: program });
  } catch (error) { next(error); }
};

export const updateProgram = async (req, res, next) => {
  try {
    const { id } = req.params;
    const program = await Program.findByPk(id);
    if (!program) return res.status(404).json({ error: 'Program not found' });

    const updateData = { ...req.body };
    if (req.file) {
      if (program.curriculum_pdf_path) deleteFile(program.curriculum_pdf_path);
      updateData.curriculum_pdf_path = `/uploads/pdfs/${req.file.filename}`;
    }

    await program.update(updateData);
    res.json({ data: program });
  } catch (error) { next(error); }
};

export const deleteProgram = async (req, res, next) => {
  try {
    const { id } = req.params;
    const program = await Program.findByPk(id);
    if (!program) return res.status(404).json({ error: 'Program not found' });

    if (program.curriculum_pdf_path) deleteFile(program.curriculum_pdf_path);
    await program.destroy();

    res.json({ data: { message: 'Program deleted successfully' } });
  } catch (error) { next(error); }
};

/* Program sections (with nested semesters/courses/outcomes/content when requested) */
export const getProgramSections = async (req, res, next) => {
  try {
    const programId = req.params.id;
    if (!programId) return res.status(400).json({ error: 'program id required' });

    const sections = await ProgramSection.findAll({
      where: { program_id: programId },
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
        { model: SectionContent, as: 'content' }
      ]
    });

    res.json({ data: sections });
  } catch (error) { next(error); }
};

export const createProgramSection = async (req, res, next) => {
  try {
    const program_id = req.params.id || req.body.program_id;
    if (!program_id) return res.status(400).json({ error: 'program_id is required' });

    const { title, section_type } = req.body;
    if (!title || !section_type) return res.status(400).json({ error: 'title and section_type required' });

    const display_order = Number(req.body.display_order) || 0;
    const is_expanded = parseBool(req.body.is_expanded) || false;

    const section = await ProgramSection.create({
      program_id,
      title,
      section_type,
      display_order,
      is_expanded
    });

    // return with nested relationships
    const created = await ProgramSection.findByPk(section.id, {
      include: [
        { model: CurriculumSemester, as: 'semesters', separate: true, order: [['display_order', 'ASC']] },
        { model: ProgramOutcome, as: 'outcomes', separate: true, order: [['display_order', 'ASC']] },
        { model: SectionContent, as: 'content' }
      ]
    });

    res.status(201).json({ data: created });
  } catch (error) { next(error); }
};

export const updateProgramSection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const section = await ProgramSection.findByPk(id);
    if (!section) return res.status(404).json({ error: 'Section not found' });

    const updateData = {};
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.section_type !== undefined) updateData.section_type = req.body.section_type;
    if (req.body.display_order !== undefined) updateData.display_order = Number(req.body.display_order);
    if (req.body.is_expanded !== undefined) updateData.is_expanded = parseBool(req.body.is_expanded);

    await section.update(updateData);
    res.json({ data: section });
  } catch (error) { next(error); }
};

export const deleteProgramSection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const section = await ProgramSection.findByPk(id);
    if (!section) return res.status(404).json({ error: 'Section not found' });

    await section.destroy();
    res.json({ data: { message: 'Section deleted successfully' } });
  } catch (error) { next(error); }
};

/* Section content create/update */
export const updateSectionContent = async (req, res, next) => {
  try {
    const { section_id, content_html } = req.body;
    if (!section_id) return res.status(400).json({ error: 'section_id required' });

    let content = await SectionContent.findOne({ where: { section_id } });
    if (content) {
      await content.update({ content_html });
    } else {
      content = await SectionContent.create({ section_id, content_html });
    }

    res.json({ data: content });
  } catch (error) { next(error); }
};

/* Program outcomes */
export const createProgramOutcome = async (req, res, next) => {
  try {
    const section_id = req.params?.id || req.body.section_id;
    if (!section_id) return res.status(400).json({ error: 'section_id required' });

    const { outcome_code, outcome_text } = req.body;
    if (!outcome_code || !outcome_text) return res.status(400).json({ error: 'code and text required' });

    const display_order = Number(req.body.display_order) || 0;

    const outcome = await ProgramOutcome.create({ section_id, outcome_code, outcome_text, display_order });
    res.status(201).json({ data: outcome });
  } catch (error) { next(error); }
};

export const updateProgramOutcome = async (req, res, next) => {
  try {
    const { id } = req.params;
    const outcome = await ProgramOutcome.findByPk(id);
    if (!outcome) return res.status(404).json({ error: 'Outcome not found' });

    await outcome.update(req.body);
    res.json({ data: outcome });
  } catch (error) { next(error); }
};

export const deleteProgramOutcome = async (req, res, next) => {
  try {
    const { id } = req.params;
    const outcome = await ProgramOutcome.findByPk(id);
    if (!outcome) return res.status(404).json({ error: 'Outcome not found' });

    await outcome.destroy();
    res.json({ data: { message: 'Outcome deleted successfully' } });
  } catch (error) { next(error); }
};

/* ==========================
   CURRICULUM: SEMESTERS + COURSES
   ========================== */
export const createCurriculumSemester = async (req, res, next) => {
  try {
    const section_id = req.params.sectionId || req.body.section_id;
    if (!section_id) return res.status(400).json({ error: 'section_id is required' });

    const semester_number = req.body.semester_number;
    const semester_name = req.body.semester_name;
    const display_order = Number(req.body.display_order) || 0;

    const semester = await CurriculumSemester.create({ section_id, semester_number, semester_name, display_order });
    res.status(201).json({ data: semester });
  } catch (error) { next(error); }
};

export const deleteCurriculumSemester = async (req, res, next) => {
  try {
    const { id } = req.params;
    const semester = await CurriculumSemester.findByPk(id);
    if (!semester) return res.status(404).json({ error: 'Semester not found' });

    await semester.destroy();
    res.json({ data: { message: 'Semester deleted successfully' } });
  } catch (error) { next(error); }
};

/* Courses */
export const createCurriculumCourse = async (req, res, next) => {
  try {
    const {
      semester_id,
      course_name,
      course_type,
      theory_hours,
      lab_hours,
      tutorial_hours,
      practical_hours,
      credits
    } = req.body;

    if (!semester_id) return res.status(400).json({ error: 'semester_id required' });
    if (!course_name) return res.status(400).json({ error: 'course_name required' });

    const display_order = Number(req.body.display_order) || 0;

    const course = await CurriculumCourse.create({
      semester_id,
      course_name,
      course_type,
      theory_hours: Number(theory_hours) || 0,
      lab_hours: Number(lab_hours) || 0,
      tutorial_hours: Number(tutorial_hours) || 0,
      practical_hours: Number(practical_hours) || 0,
      credits,
      display_order
    });

    res.status(201).json({ data: course });
  } catch (error) { next(error); }
};

export const updateCurriculumCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await CurriculumCourse.findByPk(id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    await course.update(req.body);
    res.json({ data: course });
  } catch (error) { next(error); }
};

export const deleteCurriculumCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await CurriculumCourse.findByPk(id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    await course.destroy();
    res.json({ data: { message: 'Course deleted successfully' } });
  } catch (error) { next(error); }
};

/* ==========================
   NEWS
   ========================== */
export const getAllNews = async (req, res, next) => {
  try {
    const news = await News.findAll({ order: [['date', 'DESC']] });
    res.json({ data: news });
  } catch (error) { next(error); }
};

export const createNews = async (req, res, next) => {
  try {
    const { title, summary, body } = req.body;
    const date = req.body.date ? new Date(req.body.date) : new Date();
    const isPublished = parseBool(req.body.isPublished);
    const news = await News.create({
      title,
      date,
      summary,
      body,
      image_path: req.file ? `/uploads/images/${req.file.filename}` : null,
      isPublished: isPublished === undefined ? true : isPublished
    });
    res.status(201).json({ data: news });
  } catch (error) { next(error); }
};

export const updateNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const news = await News.findByPk(id);
    if (!news) return res.status(404).json({ error: 'News not found' });

    const updateData = { ...req.body };
    if (updateData.date) updateData.date = new Date(updateData.date);
    if (req.file) {
      if (news.image_path) deleteFile(news.image_path);
      updateData.image_path = `/uploads/images/${req.file.filename}`;
    }

    await news.update(updateData);
    res.json({ data: news });
  } catch (error) { next(error); }
};

export const deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const news = await News.findByPk(id);
    if (!news) return res.status(404).json({ error: 'News not found' });

    if (news.image_path) deleteFile(news.image_path);
    await news.destroy();
    res.json({ data: { message: 'News deleted successfully' } });
  } catch (error) { next(error); }
};

/* ==========================
   EVENTS
   ========================== */
export const getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.findAll({ order: [['startsAt', 'DESC']] });
    res.json({ data: events });
  } catch (error) { next(error); }
};

export const createEvent = async (req, res, next) => {
  try {
    const { title, startsAt, endsAt, venue, description, link } = req.body;
    const isPublished = parseBool(req.body.isPublished);
    const event = await Event.create({
      title,
      startsAt,
      endsAt: endsAt || null,
      venue,
      description,
      link: link || null,
      banner_path: req.file ? `/uploads/images/${req.file.filename}` : null,
      isPublished: isPublished === undefined ? true : isPublished
    });
    res.status(201).json({ data: event });
  } catch (error) { next(error); }
};

export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const updateData = { ...req.body };
    if (req.file) {
      if (event.banner_path) deleteFile(event.banner_path);
      updateData.banner_path = `/uploads/images/${req.file.filename}`;
    }

    await event.update(updateData);
    res.json({ data: event });
  } catch (error) { next(error); }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (event.banner_path) deleteFile(event.banner_path);
    await event.destroy();
    res.json({ data: { message: 'Event deleted successfully' } });
  } catch (error) { next(error); }
};

/* ==========================
   ACHIEVEMENTS
   ========================== */
export const getAllAchievements = async (req, res, next) => {
  try {
    const achievements = await Achievement.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ data: achievements });
  } catch (error) { next(error); }
};

export const createAchievement = async (req, res, next) => {
  try {
    const { title, students, description, link } = req.body;
    const isPublished = parseBool(req.body.isPublished);
    const achievement = await Achievement.create({
      title,
      students,
      description,
      link: link || null,
      image_path: req.file ? `/uploads/images/${req.file.filename}` : null,
      isPublished: isPublished === undefined ? true : isPublished
    });
    res.status(201).json({ data: achievement });
  } catch (error) { next(error); }
};

export const updateAchievement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const achievement = await Achievement.findByPk(id);
    if (!achievement) return res.status(404).json({ error: 'Achievement not found' });

    const updateData = { ...req.body };
    if (req.file) {
      if (achievement.image_path) deleteFile(achievement.image_path);
      updateData.image_path = `/uploads/images/${req.file.filename}`;
    }

    await achievement.update(updateData);
    res.json({ data: achievement });
  } catch (error) { next(error); }
};

export const deleteAchievement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const achievement = await Achievement.findByPk(id);
    if (!achievement) return res.status(404).json({ error: 'Achievement not found' });

    if (achievement.image_path) deleteFile(achievement.image_path);
    await achievement.destroy();
    res.json({ data: { message: 'Achievement deleted successfully' } });
  } catch (error) { next(error); }
};

/* ==========================
   NEWSLETTERS
   ========================== */
export const getAllNewsletters = async (req, res, next) => {
  try {
    const newsletters = await Newsletter.findAll({ order: [['issueDate', 'DESC']] });
    res.json({ data: newsletters });
  } catch (error) { next(error); }
};

export const createNewsletter = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'PDF is required' });
    const { title, issueDate, description } = req.body;
    const newsletter = await Newsletter.create({
      title,
      issueDate,
      description,
      pdf_path: `/uploads/pdfs/${req.file.filename}`
    });
    res.status(201).json({ data: newsletter });
  } catch (error) { next(error); }
};

export const updateNewsletter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const newsletter = await Newsletter.findByPk(id);
    if (!newsletter) return res.status(404).json({ error: 'Newsletter not found' });

    const updateData = { ...req.body };
    if (req.file) {
      if (newsletter.pdf_path) deleteFile(newsletter.pdf_path);
      updateData.pdf_path = `/uploads/pdfs/${req.file.filename}`;
    }

    await newsletter.update(updateData);
    res.json({ data: newsletter });
  } catch (error) { next(error); }
};

export const deleteNewsletter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const newsletter = await Newsletter.findByPk(id);
    if (!newsletter) return res.status(404).json({ error: 'Newsletter not found' });

    if (newsletter.pdf_path) deleteFile(newsletter.pdf_path);
    await newsletter.destroy();
    res.json({ data: { message: 'Newsletter deleted successfully' } });
  } catch (error) { next(error); }
};

/* ==========================
   DIRECTORY
   ========================== */
export const getAllDirectoryEntries = async (req, res, next) => {
  try {
    const entries = await DirectoryEntry.findAll({ order: [['name', 'ASC']] });
    res.json({ data: entries });
  } catch (error) { next(error); }
};

export const createDirectoryEntry = async (req, res, next) => {
  try {
    const { name, role, phone, email, location } = req.body;
    const entry = await DirectoryEntry.create({ name, role, phone, email, location });
    res.status(201).json({ data: entry });
  } catch (error) { next(error); }
};

export const updateDirectoryEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const entry = await DirectoryEntry.findByPk(id);
    if (!entry) return res.status(404).json({ error: 'Directory entry not found' });

    await entry.update({ ...req.body });
    res.json({ data: entry });
  } catch (error) { next(error); }
};

export const deleteDirectoryEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const entry = await DirectoryEntry.findByPk(id);
    if (!entry) return res.status(404).json({ error: 'Directory entry not found' });

    await entry.destroy();
    res.json({ data: { message: 'Directory entry deleted successfully' } });
  } catch (error) { next(error); }
};

/* ==========================
   INFO BLOCKS
   ========================== */
export const getAllInfoBlocks = async (req, res, next) => {
  try {
    const blocks = await InfoBlock.findAll({ order: [['key', 'ASC']] });
    res.json({ data: blocks });
  } catch (error) { next(error); }
};

export const createInfoBlock = async (req, res, next) => {
  try {
    const { key, title, body } = req.body;
    const media_path = req.file
      ? `/uploads/${req.file.mimetype.includes('pdf') ? 'pdfs' : 'images'}/${req.file.filename}`
      : null;

    const block = await InfoBlock.create({ key, title, body, media_path });
    res.status(201).json({ data: block });
  } catch (error) { next(error); }
};

export const updateInfoBlock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const block = await InfoBlock.findByPk(id);
    if (!block) return res.status(404).json({ error: 'Info block not found' });

    const updateData = { ...req.body };
    if (req.file) {
      if (block.media_path) deleteFile(block.media_path);
      updateData.media_path = `/uploads/${req.file.mimetype.includes('pdf') ? 'pdfs' : 'images'}/${req.file.filename}`;
    }

    await block.update(updateData);
    res.json({ data: block });
  } catch (error) { next(error); }
};

export const deleteInfoBlock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const block = await InfoBlock.findByPk(id);
    if (!block) return res.status(404).json({ error: 'Info block not found' });

    if (block.media_path) deleteFile(block.media_path);
    await block.destroy();
    res.json({ data: { message: 'Info block deleted successfully' } });
  } catch (error) { next(error); }
};

/* ==========================
   RESEARCH
   ========================== */
export const getAllResearch = async (req, res, next) => {
  try {
    const research = await Research.findAll({ order: [['display_order', 'ASC']] });
    res.json({ data: research });
  } catch (error) { next(error); }
};

export const createResearch = async (req, res, next) => {
  try {
    const researchData = { ...req.body };
    if (req.file) researchData.image_path = `/uploads/images/${req.file.filename}`;
    const research = await Research.create(researchData);
    res.status(201).json({ data: research });
  } catch (error) { next(error); }
};

export const updateResearch = async (req, res, next) => {
  try {
    const research = await Research.findByPk(req.params.id);
    if (!research) return res.status(404).json({ error: 'Research not found' });
    const updateData = { ...req.body };
    if (req.file) {
      if (research.image_path) deleteFile(research.image_path);
      updateData.image_path = `/uploads/images/${req.file.filename}`;
    }
    await research.update(updateData);
    res.json({ data: research });
  } catch (error) { next(error); }
};

export const deleteResearch = async (req, res, next) => {
  try {
    const research = await Research.findByPk(req.params.id);
    if (!research) return res.status(404).json({ error: 'Research not found' });
    if (research.image_path) deleteFile(research.image_path);
    await research.destroy();
    res.json({ data: { message: 'Research deleted successfully' } });
  } catch (error) { next(error); }
};

/* ==========================
   FACILITIES
   ========================== */
export const getAllFacilities = async (req, res, next) => {
  try {
    const facilities = await Facility.findAll({ order: [['display_order', 'ASC']] });
    res.json({ data: facilities });
  } catch (error) { next(error); }
};

export const createFacility = async (req, res, next) => {
  try {
    const facilityData = { ...req.body };
    if (req.file) facilityData.image_path = `/uploads/images/${req.file.filename}`;
    const facility = await Facility.create(facilityData);
    res.status(201).json({ data: facility });
  } catch (error) { next(error); }
};

export const updateFacility = async (req, res, next) => {
  try {
    const facility = await Facility.findByPk(req.params.id);
    if (!facility) return res.status(404).json({ error: 'Facility not found' });
    const updateData = { ...req.body };
    if (req.file) {
      if (facility.image_path) deleteFile(facility.image_path);
      updateData.image_path = `/uploads/images/${req.file.filename}`;
    }
    await facility.update(updateData);
    res.json({ data: facility });
  } catch (error) { next(error); }
};

export const deleteFacility = async (req, res, next) => {
  try {
    const facility = await Facility.findByPk(req.params.id);
    if (!facility) return res.status(404).json({ error: 'Facility not found' });
    if (facility.image_path) deleteFile(facility.image_path);
    await facility.destroy();
    res.json({ data: { message: 'Facility deleted successfully' } });
  } catch (error) { next(error); }
};
