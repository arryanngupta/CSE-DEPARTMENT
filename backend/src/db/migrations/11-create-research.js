import { DataTypes } from 'sequelize';

export const up = async (queryInterface) => {
  await queryInterface.createTable('research', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // 🔹 Basic Info
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true, // e.g., "Project", "Publication", "Patent"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // 🔹 Additional Research Details
    faculty: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Name(s) of faculty involved in the research',
    },
    funding_agency: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Agency or organization providing funding',
    },
    funding_amount: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Amount of funding received (in INR/USD)',
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Duration of the research, e.g. 2023–2025',
    },
    status: {
      type: DataTypes.ENUM('Ongoing', 'Completed', 'Proposed'),
      allowNull: true,
      defaultValue: 'Ongoing',
    },

    // 🔹 Links and Media
    link: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'External link to publication/project site',
    },
    image_path: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Path or URL to research thumbnail image',
    },

    // 🔹 Display Management
    display_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    // 🔹 Timestamps
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });
};

export const down = async (queryInterface) => {
  await queryInterface.dropTable('research');
};
