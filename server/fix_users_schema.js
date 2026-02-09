const sequelize = require('./src/config/db.config');

async function fixSchema() {
  try {
    console.log('Adding columns to Users table...');
    
    // Add businessName
    try {
      await sequelize.query('ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "businessName" VARCHAR(255);');
      console.log('✅ Column businessName added (or already existed)');
    } catch (e) {
      console.log('Note: businessName column issue:', e.message);
    }

    // Add accountType as ENUM
    try {
      // First, create the type if it doesn't exist
      await sequelize.query(`
        DO $$ 
        BEGIN 
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_Users_accountType') THEN
            CREATE TYPE "enum_Users_accountType" AS ENUM('PATIENT', 'PROFESSIONAL', 'CLINIC', 'HOSPITAL');
          END IF;
        END $$;
      `);
      
      // Then add the column using the custom type name Sequelize uses
      await sequelize.query('ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "accountType" "enum_Users_accountType" DEFAULT \'PATIENT\';');
      console.log('✅ Column accountType added (or already existed)');
    } catch (e) {
      console.log('Note: accountType column issue:', e.message);
    }

    console.log('Schema update completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing schema:', error);
    process.exit(1);
  }
}

fixSchema();
