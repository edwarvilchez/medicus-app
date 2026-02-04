const sequelize = require('../config/db.config');

const fixMigration = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected...');
    
    const queryInterface = sequelize.getQueryInterface();
    
    // Attempt to add medicalLeaveStartDate
    try {
        await queryInterface.addColumn('MedicalRecords', 'medicalLeaveStartDate', {
            type: 'DATEONLY',
            allowNull: true
        });
        console.log('SUCCESS: Added medicalLeaveStartDate column');
    } catch (e) {
        console.error('FAILED to add medicalLeaveStartDate:', e.message);
    }
    
    // Attempt to add medicalLeaveDays just in case
    try {
        await queryInterface.addColumn('MedicalRecords', 'medicalLeaveDays', {
            type: 'INTEGER',
            defaultValue: 0
        });
        console.log('SUCCESS: Added medicalLeaveDays column');
    } catch (e) {
        console.error('FAILED to add medicalLeaveDays (likely exists):', e.message);
    }

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

fixMigration();
