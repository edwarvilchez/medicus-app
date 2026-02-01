const sequelize = require('../config/db.config');

async function addColumn() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    
    await sequelize.query('ALTER TABLE "Appointments" ADD COLUMN "reminderSent" BOOLEAN DEFAULT false;');
    
    console.log('✅ Column reminderSent added successfully.');
    process.exit(0);
  } catch (error) {
    if (error.original && error.original.code === '42701') {
        console.log('ℹ️ Column already exists.');
        process.exit(0);
    }
    console.error('❌ Error adding column:', error);
    process.exit(1);
  }
}

addColumn();
