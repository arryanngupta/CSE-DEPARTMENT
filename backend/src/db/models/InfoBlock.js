import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const InfoBlock = sequelize.define('InfoBlock', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  media_path: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'info_blocks',
  timestamps: true
});

export default InfoBlock;