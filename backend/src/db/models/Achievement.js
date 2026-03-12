import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const Achievement = sequelize.define('Achievement', {
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
    type: DataTypes.ENUM('student', 'faculty'),
    allowNull: false,
    defaultValue: 'student'
  },
  students: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
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
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'achievements',
  timestamps: true
});

export default Achievement;
