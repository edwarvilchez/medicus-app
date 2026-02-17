const seedRoles = require('./src/utils/seeder');
const seedTestData = require('./src/utils/testSeeder');
require('dotenv').config();
const sequelize = require('./src/config/db.config');

const runSeeder = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB Connected');
    await sequelize.sync({ force: false });
    console.log('DB Synced');
    await seedRoles();
    console.log('Roles seeded');
    await seedTestData();
    console.log('Test data seeded');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

runSeeder();
