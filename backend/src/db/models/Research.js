import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const Research = sequelize.define('Research', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  category: {
    type: DataTypes.ENUM(
      'Publication',
      'Project',
      'Patent',
      'Collaboration'
    ),
    allowNull: false
  },

  /* ===== Common ===== */
  description: DataTypes.TEXT,
  link: DataTypes.STRING,
  image_path: DataTypes.STRING,
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  /* ===== Publications ===== */
  authors: DataTypes.TEXT,
  journal: DataTypes.STRING,
  year: DataTypes.STRING,

  /* ===== Projects ===== */
  faculty: DataTypes.STRING,
  funding_agency: DataTypes.STRING,
  funding_amount: DataTypes.STRING,
  duration: DataTypes.STRING,
  status: DataTypes.ENUM(
  'Ongoing',
  'In Progress',
  'Completed',
  'Published'
),


  /* ===== Patents ===== */
  inventors: DataTypes.TEXT,
  application_no: DataTypes.STRING,
  patent_status: DataTypes.STRING,

  /* ===== Collaborations ===== */
  collaboration_org: DataTypes.STRING,

}, {
  tableName: 'research',
  timestamps: true
});

export default Research;
