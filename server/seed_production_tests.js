/**
 * Standalone script to seed test data in production.
 * Delegates to the unified testSeeder used by the server on startup.
 *
 * Usage:  node seed_production_tests.js
 */
const { sequelize } = require('./src/models');
const seedRoles = require('./src/utils/seeder');
const seedTestData = require('./src/utils/testSeeder');

(async () => {
  try {
    console.log('🚀 Connecting to database...');
    await sequelize.authenticate();

    console.log('📦 Syncing schema...');
    await sequelize.sync({ force: false });

    console.log('🔑 Seeding roles...');
    await seedRoles();

    console.log('👥 Seeding test users...');
    await seedTestData();

    console.log('🏁 Done.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})();
