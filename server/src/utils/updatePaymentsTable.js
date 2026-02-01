const sequelize = require('../config/db.config');

async function updatePaymentTable() {
  try {
    console.log('🔧 Actualizando tabla Payments con nuevas columnas...');
    
    // Agregar columna bank
    await sequelize.query(`
      ALTER TABLE "Payments" 
      ADD COLUMN IF NOT EXISTS "bank" VARCHAR(255);
    `);

    // Agregar columna instrument
    await sequelize.query(`
      ALTER TABLE "Payments" 
      ADD COLUMN IF NOT EXISTS "instrument" VARCHAR(255);
    `);

    console.log('✅ Columnas bank e instrument agregadas exitosamente.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al actualizar tabla Payments:', error);
    process.exit(1);
  }
}

updatePaymentTable();
