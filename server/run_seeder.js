const seedTestData = require('./src/utils/testSeeder');
const sequelize = require('./src/config/db.config');

async function runSeeder() {
  try {
    console.log('Running Test Seeder...');
    await seedTestData();
    console.log('✅ Seeding completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error running seeder:', error);
    process.exit(1);
  }
}

runSeeder();
