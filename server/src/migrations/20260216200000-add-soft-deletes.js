module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add deletedAt and deletedBy to all main tables
    const tables = [
      'Users',
      'Patients',
      'Appointments',
      'MedicalRecords',
      'LabResults',
      'Payments',
      'Doctors',
      'Nurses',
      'Staffs',
      'VideoConsultations',
      'Organizations'
    ];

    for (const table of tables) {
      try {
        // Check if columns already exist
        const tableInfo = await queryInterface.describeTable(table);
        
        if (!tableInfo.deletedAt) {
          await queryInterface.addColumn(table, 'deletedAt', {
            type: Sequelize.DATE,
            allowNull: true
          });
          console.log(`✅ Added deletedAt to ${table}`);
        }

        if (!tableInfo.deletedBy) {
          await queryInterface.addColumn(table, 'deletedBy', {
            type: Sequelize.UUID,
            allowNull: true
          });
          console.log(`✅ Added deletedBy to ${table}`);
        }
      } catch (error) {
        console.log(`⚠️ Table ${table} may not exist or columns already added: ${error.message}`);
      }
    }

    console.log('\n✅ Soft delete columns added to all tables');
  },

  down: async (queryInterface, Sequelize) => {
    const tables = [
      'Users',
      'Patients',
      'Appointments',
      'MedicalRecords',
      'LabResults',
      'Payments',
      'Doctors',
      'Nurses',
      'Staffs',
      'VideoConsultations',
      'Organizations'
    ];

    for (const table of tables) {
      try {
        await queryInterface.removeColumn(table, 'deletedAt');
        await queryInterface.removeColumn(table, 'deletedBy');
        console.log(`✅ Removed soft delete columns from ${table}`);
      } catch (error) {
        console.log(`⚠️ Could not remove columns from ${table}: ${error.message}`);
      }
    }
  }
};
