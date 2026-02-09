const { sequelize } = require('./src/models');

async function addGenderColumn() {
  try {
    const queryInterface = sequelize.getQueryInterface();
    const tableInfo = await queryInterface.describeTable('Users');
    
    if (!tableInfo.gender) {
      console.log('Adding gender column to Users table...');
      await queryInterface.addColumn('Users', 'gender', {
        type: sequelize.Sequelize.ENUM('Male', 'Female'),
        allowNull: true
      });
      console.log('Gender column added successfully.');
    } else {
      console.log('Gender column already exists.');
    }

    // Now, let's migrate data from Patients table if exists
    // We can do this with raw SQL
    console.log('Migrating gender from Patients table...');
    await sequelize.query(`
      UPDATE "Users"
      SET gender = "Patients".gender::"enum_Users_gender"
      FROM "Patients"
      WHERE "Users".id = "Patients"."userId" AND "Users".gender IS NULL;
    `);
    
    // Also migrate other roles if we can infer or default them
    // For now, let's leave them null or default to Female for Nurses if common, but that's bad practice.
    // Instead, we will rely on registration/profile updates.

  } catch (error) {
    console.error('Error adding gender column:', error);
  } finally {
    await sequelize.close();
  }
}

addGenderColumn();
