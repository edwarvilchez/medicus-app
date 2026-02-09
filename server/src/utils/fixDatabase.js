const sequelize = require('../config/db.config');

async function addGenderColumn() {
  try {
    console.log('🔧 Agregando columna gender a tabla Users...');
    
    // Check if column exists
    const [results, metadata] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='Users' AND column_name='gender';
    `);

    if (results.length === 0) {
      // PostgreSQL: Create ENUM type first if not exists
      try {
        await sequelize.query(`CREATE TYPE "enum_Users_gender" AS ENUM ('Male', 'Female');`);
      } catch (e) {
        console.log('Type enum_Users_gender might already exist or handled automatically.');
      }
      
      await sequelize.query(`
        ALTER TABLE "Users" 
        ADD COLUMN "gender" "enum_Users_gender";
      `);
      console.log('✅ Columna gender agregada exitosamente.');
      
      // Migrate data from Patients
      console.log('🔄 Migrando datos de género desde Patients...');
      /*
        Warning: Patient gender might be 'Other' which is not in User gender ENUM ('Male', 'Female').
        We need to handle this.
        If Patient gender is 'Male' or 'Female', copy it.
        If 'Other', set NULL or default?
        Let's assume we copy 'Male' and 'Female' only for now, or expand the ENUM.
        User only has 'Male', 'Female'. So 'Other' will fail if copied directly.
      */
      
      await sequelize.query(`
        UPDATE "Users" u
        SET gender = p.gender::text::"enum_Users_gender"
        FROM "Patients" p
        WHERE u.id = p."userId" 
        AND (p.gender = 'Male' OR p.gender = 'Female');
      `);
      console.log('✅ Migración de datos completada.');
      
    } else {
      console.log('⚠️ La columna gender ya existe en Users.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al alterar tabla:', error);
    process.exit(1);
  }
}

addGenderColumn();
