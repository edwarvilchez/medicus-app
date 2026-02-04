const sequelize = require('../config/db.config');

const migrate = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected...');
    
    const queryInterface = sequelize.getQueryInterface();
    
    try {
      await queryInterface.addColumn('MedicalRecords', 'medicalLeaveDays', {
        type: 'INTEGER',
        defaultValue: 0
      });
      console.log('Added medicalLeaveDays column');
    } catch (e) {
      console.log('medicalLeaveDays column might already exist');
    }

    try {
      await queryInterface.addColumn('MedicalRecords', 'medicalLeaveStartDate', {
        type: 'DATEONLY'
      });
      console.log('Added medicalLeaveStartDate column');
    } catch (e) {
      console.log('medicalLeaveStartDate column might already exist');
    }

    console.log('Migration completed');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
