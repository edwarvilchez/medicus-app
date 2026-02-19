require('dotenv').config();
const sequelize = require('../config/db.config');
const seedRoles = require('./seeder');
const seedTestData = require('./testSeeder');

const resetDb = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    
    console.log('⚠️  DROPPING ALL TABLES AND RE-SYNCING...');
    await sequelize.sync({ force: true });
    
    console.log('🌱 Seeding Roles...');
    await seedRoles();
    
    console.log('🌱 Seeding Test Data...');
    await seedTestData();
    
    console.log('✅ Database reset complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    process.exit(1);
  }
};

resetDb();
