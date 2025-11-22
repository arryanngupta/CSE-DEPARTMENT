// src/db/models/index.js
import User from './Users.js';
import Slider from './Slider.js';
import People from './People.js';
import Program from './Program.js';
import News from './News.js';
import Event from './Event.js';
import Achievement from './Achievement.js';
import Newsletter from './Newsletter.js';
import DirectoryEntry from './DirectoryEntry.js';
import InfoBlock from './InfoBlock.js';
import Research from './Research.js';
import Facility from './Facility.js';
import {
  ProgramSection,
  CurriculumSemester,
  CurriculumCourse,
  ProgramOutcome,
  SectionContent
} from './ProgramSection.js';

import { sequelize } from '../../config/database.js';

// Associations
Program.hasMany(ProgramSection, { foreignKey: 'program_id', as: 'sections' });
ProgramSection.belongsTo(Program, { foreignKey: 'program_id' });

// Export all
export {
  sequelize,
  User,
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
};
