// backend/src/db/migrations/20250102-fix-people-columns.js
import { DataTypes } from "sequelize";

export async function up(queryInterface) {
  const table = "People";

  // Helper: safely add column only if not present
  async function addColumnSafe(col, def) {
    const columns = await queryInterface.describeTable(table);

    if (!columns[col]) {
      console.log(`➡️ Adding column: ${col}`);
      return queryInterface.addColumn(table, col, def);
    } else {
      console.log(`⏭️ Column already exists: ${col}`);
    }
  }

  await addColumnSafe("slug", {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  });

  await addColumnSafe("phone", { type: DataTypes.STRING });
  await addColumnSafe("webpage", { type: DataTypes.STRING });
  await addColumnSafe("bio", { type: DataTypes.TEXT });
  await addColumnSafe("education", { type: DataTypes.JSON });
  await addColumnSafe("publications", { type: DataTypes.JSON });
  await addColumnSafe("workshops", { type: DataTypes.JSON });
}

export async function down(queryInterface) {
  const table = "People";

  const safeRemove = (col) =>
    queryInterface.removeColumn(table, col).catch(() => {});

  await safeRemove("slug");
  await safeRemove("phone");
  await safeRemove("webpage");
  await safeRemove("bio");
  await safeRemove("education");
  await safeRemove("publications");
  await safeRemove("workshops");
}
