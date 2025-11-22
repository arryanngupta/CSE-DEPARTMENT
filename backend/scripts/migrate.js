import { sequelize } from '../src/config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsDir = path.join(__dirname, '../src/db/migrations');
const seedersDir = path.join(__dirname, '../src/db/seeders');

const runMigrations = async (direction = 'up') => {
  try {
    const files = fs.readdirSync(migrationsDir).sort();

    console.log(`\n🚀 Running migrations: ${direction.toUpperCase()}\n`);

    for (const file of files) {
      if (file.endsWith('.js')) {
        const filePath = path.join(migrationsDir, file);
        const moduleUrl = pathToFileURL(filePath).href;

        const migration = await import(moduleUrl);

        console.log(`${direction === 'up' ? '⬆️' : '⬇️'}  ${file}`);
        await migration[direction](sequelize.getQueryInterface());
      }
    }

    console.log('\n✅ Migrations completed successfully\n');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
};

const runSeeders = async () => {
  try {
    const files = fs.readdirSync(seedersDir).sort();

    console.log('\n🌱 Running seeders...\n');

    for (const file of files) {
      if (file.endsWith('.js')) {
        const filePath = path.join(seedersDir, file);
        const moduleUrl = pathToFileURL(filePath).href;

        const seeder = await import(moduleUrl);

        console.log(`🌿 Seeding: ${file}`);
        await seeder.up(sequelize.getQueryInterface());
      }
    }

    console.log('\n✅ Seeders completed successfully\n');
  } catch (error) {
    console.error('\n❌ Seeder failed:', error);
    process.exit(1);
  }
};

const command = process.argv[2];

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    switch (command) {
      case 'up':
        await runMigrations('up');
        break;
      case 'down':
        await runMigrations('down');
        break;
      case 'seed':
        await runSeeders();
        break;
      case 'reset':
        console.log('\n♻️ Resetting database...\n');
        await runMigrations('down');
        await runMigrations('up');
        await runSeeders();
        console.log('\n🔄 Database reset completed\n');
        break;
      default:
        console.log('⚠️ Usage: node scripts/migrate.js [up|down|seed|reset]');
        process.exit(1);
    }

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
})();
