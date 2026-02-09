const sequelize = require('./src/config/db.config');

async function addAppointmentType() {
  try {
    console.log('🔧 Agregando columna type a tabla Appointments...');
    
    // Check if column exists
    const [results] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='Appointments' AND column_name='type';
    `);

    if (results.length === 0) {
      // Create ENUM type first
      try {
        await sequelize.query(`CREATE TYPE "enum_Appointments_type" AS ENUM ('In-Person', 'Video');`);
      } catch (e) {
        console.log('Type enum_Appointments_type might already exist.');
      }
      
      await sequelize.query(`
        ALTER TABLE "Appointments" 
        ADD COLUMN "type" "enum_Appointments_type" DEFAULT 'In-Person';
      `);
      console.log('✅ Columna type agregada exitosamente.');
      
      // Update existing appointments that have a VideoConsultation to be 'Video'
      console.log('🔄 Actualizando citas existentes con videoconsultas...');
      await sequelize.query(`
        UPDATE "Appointments"
        SET "type" = 'Video'
        WHERE "id" IN (SELECT "appointmentId" FROM "VideoConsultations");
      `);
      console.log('✅ Actualización completada.');
      
    } else {
      console.log('⚠️ La columna type ya existe en Appointments.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addAppointmentType();
