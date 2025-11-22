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
    type: DataTypes.ENUM('Area', 'Project', 'Publication', 'Patent'),
    allowNull: false,
    defaultValue: 'Area'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  faculty: {
    type: DataTypes.STRING,
    allowNull: true
  },
  funding_agency: {
    type: DataTypes.STRING,
    allowNull: true
  },
  funding_amount: {
    type: DataTypes.STRING,
    allowNull: true
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Ongoing', 'Completed', 'Published'),
    allowNull: true
  },
  link: {
    type: DataTypes.STRING,
    allowNull: true
  },
  image_path: {
    type: DataTypes.STRING,
    allowNull: true
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'research',
  timestamps: true
});

export default Research;
