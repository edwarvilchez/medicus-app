const sequelize = require('../config/db.config');

async function addSpecialtyColumn() {
  try {
    console.log('🔧 Agregando columna specialtyId a tabla Doctors...');
    
    // PostgreSQL raw query to add column if not exists
    await sequelize.query(`
      ALTER TABLE "Doctors" 
      ADD COLUMN IF NOT EXISTS "specialtyId" INTEGER 
      REFERENCES "Specialties" ("id") 
      ON DELETE SET NULL 
      ON UPDATE CASCADE;
    `);

    console.log('✅ Columna agregada exitosamente.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al alterar tabla:', error);
    process.exit(1);
  }
}

addSpecialtyColumn();
