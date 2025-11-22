// src/db/migrations/003-update-programs.js
import { DataTypes } from "sequelize";

export const up = async (queryInterface, Sequelize) => {
  // Normalize table names (lowercase)
  const existingTables = (await queryInterface.showAllTables()).map((t) =>
    t.toString().toLowerCase()
  );

  const normalize = (name) => name.toString().toLowerCase();

  // Read programs table
  const programsTable = await queryInterface.describeTable("programs");

  const safeAdd = async (column, options) => {
    if (!programsTable[column]) {
      await queryInterface.addColumn("programs", column, options);
    }
  };

  // ---- PROGRAMS COLUMN ADDITIONS ----
  await safeAdd("short_name", {
    type: DataTypes.STRING(20),
    allowNull: true,
  });

  await safeAdd("overview", {
    type: DataTypes.TEXT,
    allowNull: true,
  });

  await safeAdd("duration", {
    type: DataTypes.STRING(50),
    allowNull: true,
  });

  await safeAdd("total_credits", {
    type: DataTypes.INTEGER,
    allowNull: true,
  });

  await safeAdd("display_order", {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  });

  // ---- SAFE TABLE CREATION ----
  const ensureTable = async (name, attrs, indices = []) => {
    if (!existingTables.includes(normalize(name))) {
      await queryInterface.createTable(name, attrs);

      for (const idx of indices) {
        await queryInterface.addIndex(name, idx);
      }

      existingTables.push(normalize(name));
    }
  };

  // ----- program_sections -----
  await ensureTable(
    "program_sections",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      program_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "programs", key: "id" },
        onDelete: "CASCADE",
      },
      title: { type: DataTypes.STRING, allowNull: false },
      section_type: {
        type: DataTypes.ENUM("curriculum", "info", "outcome", "overview"),
        allowNull: false,
      },
      display_order: { type: DataTypes.INTEGER, defaultValue: 0 },
      is_expanded: { type: DataTypes.BOOLEAN, defaultValue: false },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    },
    [["program_id"]]
  );

  // ----- curriculum_semesters -----
  await ensureTable(
    "curriculum_semesters",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      section_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "program_sections", key: "id" },
        onDelete: "CASCADE",
      },
      semester_number: { type: DataTypes.INTEGER, allowNull: false },
      semester_name: { type: DataTypes.STRING, allowNull: false },
      display_order: { type: DataTypes.INTEGER, defaultValue: 0 },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    },
    [["section_id"]]
  );

  // ----- curriculum_courses -----
  await ensureTable(
    "curriculum_courses",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      semester_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "curriculum_semesters", key: "id" },
        onDelete: "CASCADE",
      },
      course_name: { type: DataTypes.STRING, allowNull: false },
      course_type: { type: DataTypes.STRING(10), allowNull: true },
      theory_hours: { type: DataTypes.INTEGER, defaultValue: 0 },
      lab_hours: { type: DataTypes.INTEGER, defaultValue: 0 },
      tutorial_hours: { type: DataTypes.INTEGER, defaultValue: 0 },
      practical_hours: { type: DataTypes.INTEGER, defaultValue: 0 },
      credits: { type: DataTypes.INTEGER, allowNull: false },
      display_order: { type: DataTypes.INTEGER, defaultValue: 0 },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    },
    [["semester_id"]]
  );

  // ----- program_outcomes -----
  await ensureTable(
    "program_outcomes",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      section_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "program_sections", key: "id" },
        onDelete: "CASCADE",
      },
      outcome_code: { type: DataTypes.STRING(20), allowNull: false },
      outcome_text: { type: DataTypes.TEXT, allowNull: false },
      display_order: { type: DataTypes.INTEGER, defaultValue: 0 },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    },
    [["section_id"]]
  );

  // ----- section_content -----
  await ensureTable("section_content", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    section_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "program_sections", key: "id" },
      onDelete: "CASCADE",
    },
    content_html: { type: DataTypes.TEXT, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
  });
};

export const down = async (queryInterface) => {
  await queryInterface.dropTable("section_content");
  await queryInterface.dropTable("program_outcomes");
  await queryInterface.dropTable("curriculum_courses");
  await queryInterface.dropTable("curriculum_semesters");
  await queryInterface.dropTable("program_sections");

  await queryInterface.removeColumn("programs", "short_name");
  await queryInterface.removeColumn("programs", "overview");
  await queryInterface.removeColumn("programs", "duration");
  await queryInterface.removeColumn("programs", "total_credits");
  await queryInterface.removeColumn("programs", "display_order");
};
