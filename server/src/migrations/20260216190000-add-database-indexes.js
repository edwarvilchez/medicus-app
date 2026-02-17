// Migration: Add critical database indexes for performance
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Users table indexes
    await queryInterface.addIndex('users', ['email'], {
      unique: true,
      name: 'idx_users_email'
    });
    await queryInterface.addIndex('users', ['username'], {
      unique: true,
      name: 'idx_users_username'
    });
    await queryInterface.addIndex('users', ['roleId'], {
      name: 'idx_users_roleId'
    });
    await queryInterface.addIndex('users', ['organizationId'], {
      name: 'idx_users_organizationId'
    });

    // Appointments table indexes
    await queryInterface.addIndex('appointments', ['doctorId', 'date', 'status'], {
      name: 'idx_appointments_doctor_date_status'
    });
    await queryInterface.addIndex('appointments', ['patientId', 'date'], {
      name: 'idx_appointments_patient_date'
    });
    await queryInterface.addIndex('appointments', ['date', 'status'], {
      name: 'idx_appointments_date_status'
    });

    // Patients table indexes
    await queryInterface.addIndex('patients', ['documentId'], {
      unique: true,
      name: 'idx_patients_documentId'
    });
    await queryInterface.addIndex('patients', ['userId'], {
      name: 'idx_patients_userId'
    });

    // Payments table indexes
    await queryInterface.addIndex('payments', ['patientId', 'createdAt'], {
      name: 'idx_payments_patient_createdAt'
    });
    await queryInterface.addIndex('payments', ['status', 'createdAt'], {
      name: 'idx_payments_status_createdAt'
    });

    // Medical Records indexes
    await queryInterface.addIndex('medical_records', ['patientId', 'createdAt'], {
      name: 'idx_medical_records_patient_createdAt'
    });

    // Lab Results indexes
    await queryInterface.addIndex('lab_results', ['patientId', 'createdAt'], {
      name: 'idx_lab_results_patient_createdAt'
    });

    console.log('✅ Database indexes created successfully');
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all indexes
    await queryInterface.removeIndex('users', 'idx_users_email');
    await queryInterface.removeIndex('users', 'idx_users_username');
    await queryInterface.removeIndex('users', 'idx_users_roleId');
    await queryInterface.removeIndex('users', 'idx_users_organizationId');
    await queryInterface.removeIndex('appointments', 'idx_appointments_doctor_date_status');
    await queryInterface.removeIndex('appointments', 'idx_appointments_patient_date');
    await queryInterface.removeIndex('appointments', 'idx_appointments_date_status');
    await queryInterface.removeIndex('patients', 'idx_patients_documentId');
    await queryInterface.removeIndex('patients', 'idx_patients_userId');
    await queryInterface.removeIndex('payments', 'idx_payments_patient_createdAt');
    await queryInterface.removeIndex('payments', 'idx_payments_status_createdAt');
    await queryInterface.removeIndex('medical_records', 'idx_medical_records_patient_createdAt');
    await queryInterface.removeIndex('lab_results', 'idx_lab_results_patient_createdAt');
  }
};
