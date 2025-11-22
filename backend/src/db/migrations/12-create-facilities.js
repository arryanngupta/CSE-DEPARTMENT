import { DataTypes } from 'sequelize';

export const up = async (queryInterface) => {
  await queryInterface.createTable('facilities', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('Laboratory', 'Infrastructure', 'Equipment', 'Software', 'Other'),
      allowNull: false,
      defaultValue: 'Laboratory',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    specifications: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    capacity: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    in_charge: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    image_path: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    gallery_images: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    display_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    // ✅ timestamps (required by Sequelize)
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: queryInterface.sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: queryInterface.sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    },
  });

  // Optional indexes for performance
  // await queryInterface.addIndex('facilities', ['category']);
  // await queryInterface.addIndex('facilities', ['is_active']);
};

export const down = async (queryInterface) => {
  await queryInterface.dropTable('facilities');
};
