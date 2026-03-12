import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const People = sequelize.define(
  "People",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    slug: {
      type: DataTypes.STRING,
      unique: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    designation: {
      type: DataTypes.STRING,
    },

    person_type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Faculty"
    },

    email: {
      type: DataTypes.STRING,
    },

    phone: {
      type: DataTypes.STRING,
    },

    webpage: {
      type: DataTypes.STRING,
    },

    photo_path: {
      type: DataTypes.STRING,
    },

    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    research_areas: {
      type: DataTypes.TEXT,
    },

    bio: {
      type: DataTypes.TEXT,
    },

    joining_date: {
      type: DataTypes.DATE,
    },

    department: {
      type: DataTypes.STRING,
    },

    education: {
      type: DataTypes.JSON,
    },

    publications: {
      type: DataTypes.JSON,
    },

    workshops: {
      type: DataTypes.JSON,
    },

    // 🔥 ADD THIS FIELD
    profile_sections: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },

    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "people",
    freezeTableName: true,
    timestamps: true,
  }
);

export default People;