// src/db/models/ProgramSection.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

export const ProgramSection = sequelize.define('ProgramSection', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  program_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  section_type: {
    type: DataTypes.ENUM('curriculum', 'info', 'outcome', 'overview'),
    allowNull: false
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_expanded: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'program_sections',
  timestamps: true
});

export const CurriculumSemester = sequelize.define('CurriculumSemester', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  section_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  semester_number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  semester_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'curriculum_semesters',
  timestamps: true
});

export const CurriculumCourse = sequelize.define('CurriculumCourse', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  semester_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  course_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  course_type: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  theory_hours: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lab_hours: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tutorial_hours: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  practical_hours: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  credits: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'curriculum_courses',
  timestamps: true
});

export const ProgramOutcome = sequelize.define('ProgramOutcome', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  section_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  outcome_code: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  outcome_text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'program_outcomes',
  timestamps: true
});

export const SectionContent = sequelize.define('SectionContent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  section_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  content_html: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'section_content',
  timestamps: true
});

// Define associations
ProgramSection.hasMany(CurriculumSemester, { foreignKey: 'section_id', as: 'semesters' });
ProgramSection.hasMany(ProgramOutcome, { foreignKey: 'section_id', as: 'outcomes' });
ProgramSection.hasOne(SectionContent, { foreignKey: 'section_id', as: 'content' });

CurriculumSemester.belongsTo(ProgramSection, { foreignKey: 'section_id' });
CurriculumSemester.hasMany(CurriculumCourse, { foreignKey: 'semester_id', as: 'courses' });

CurriculumCourse.belongsTo(CurriculumSemester, { foreignKey: 'semester_id' });
ProgramOutcome.belongsTo(ProgramSection, { foreignKey: 'section_id' });
SectionContent.belongsTo(ProgramSection, { foreignKey: 'section_id' });