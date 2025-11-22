// src/db/models/People.js

import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const People = sequelize.define("People", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  // ADD THIS 👇
  slug: {
    type: DataTypes.STRING,
    unique: true
  },

  name: { type: DataTypes.STRING, allowNull: false },
  designation: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  webpage: { type: DataTypes.STRING },
  photo_path: { type: DataTypes.STRING },
  research_areas: { type: DataTypes.TEXT },
  bio: { type: DataTypes.TEXT },
  joining_date: { type: DataTypes.DATE },
  department: { type: DataTypes.STRING },
  education: { type: DataTypes.JSON },
  publications: { type: DataTypes.JSON },
  workshops: { type: DataTypes.JSON },
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
});

export default People;
