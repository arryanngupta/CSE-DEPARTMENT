// src/db/models/Program.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const Program = sequelize.define('Program', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  short_name: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  level: {
    type: DataTypes.ENUM('UG', 'PG', 'PhD'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  overview: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  duration: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  total_credits: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  curriculum_pdf_path: {
    type: DataTypes.STRING,
    allowNull: true
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'programs',
  timestamps: true
});

export default Program;