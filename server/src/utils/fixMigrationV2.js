const sequelize = require('../config/db.config');
const { DataTypes } = require('sequelize');

const fixMigration = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected...');
    
    const queryInterface = sequelize.getQueryInterface();
    
    // Attempt to add medicalLeaveStartDate with correct Postgres type
    try {
        await queryInterface.addColumn('MedicalRecords', 'medicalLeaveStartDate', {
            type: DataTypes.DATEONLY, // Let Sequelize map to 'DATE' for Postgres
            allowNull: true
        });
        console.log('SUCCESS: Added medicalLeaveStartDate column');
    } catch (e) {
        console.error('FAILED to add medicalLeaveStartDate:', e.message);
        
        // Fallback: try raw query if Sequelize abstraction fails or mapping is off
        try {
            await sequelize.query('ALTER TABLE "MedicalRecords" ADD COLUMN "medicalLeaveStartDate" DATE;');
            console.log('SUCCESS: Added medicalLeaveStartDate column via raw query');
        } catch (e2) {
             console.error('FAILED raw query:', e2.message);
        }
    }

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

fixMigration();
