// Migration: Add critical database indexes for performance
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Users table indexes
    await queryInterface.addIndex('Users', ['email'], {
      unique: true,
      name: 'idx_users_email'
    });
    await queryInterface.addIndex('Users', ['username'], {
      unique: true,
      name: 'idx_users_username'
    });
    await queryInterface.addIndex('Users', ['roleId'], {
      name: 'idx_users_roleId'
    });
    await queryInterface.addIndex('Users', ['organizationId'], {
      name: 'idx_users_organizationId'
    });

    // Appointments table indexes
    await queryInterface.addIndex('Appointments', ['doctorId', 'date', 'status'], {
      name: 'idx_appointments_doctor_date_status'
    });
    await queryInterface.addIndex('Appointments', ['patientId', 'date'], {
      name: 'idx_appointments_patient_date'
    });
    await queryInterface.addIndex('Appointments', ['date', 'status'], {
      name: 'idx_appointments_date_status'
    });

    // Patients table indexes
    await queryInterface.addIndex('Patients', ['documentId'], {
      unique: true,
      name: 'idx_patients_documentId'
    });
    await queryInterface.addIndex('Patients', ['userId'], {
      name: 'idx_patients_userId'
    });

    // Payments table indexes
    await queryInterface.addIndex('Payments', ['patientId', 'createdAt'], {
      name: 'idx_payments_patient_createdAt'
    });
    await queryInterface.addIndex('Payments', ['status', 'createdAt'], {
      name: 'idx_payments_status_createdAt'
    });

    // Medical Records indexes
    await queryInterface.addIndex('MedicalRecords', ['patientId', 'createdAt'], {
      name: 'idx_medical_records_patient_createdAt'
    });

    // Lab Results indexes
    await queryInterface.addIndex('LabResults', ['patientId', 'createdAt'], {
      name: 'idx_lab_results_patient_createdAt'
    });

    console.log('✅ Database indexes created successfully');
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all indexes
    await queryInterface.removeIndex('Users', 'idx_users_email');
    await queryInterface.removeIndex('Users', 'idx_users_username');
    await queryInterface.removeIndex('Users', 'idx_users_roleId');
    await queryInterface.removeIndex('Users', 'idx_users_organizationId');
    await queryInterface.removeIndex('Appointments', 'idx_appointments_doctor_date_status');
    await queryInterface.removeIndex('Appointments', 'idx_appointments_patient_date');
    await queryInterface.removeIndex('Appointments', 'idx_appointments_date_status');
    await queryInterface.removeIndex('Patients', 'idx_patients_documentId');
    await queryInterface.removeIndex('Patients', 'idx_patients_userId');
    await queryInterface.removeIndex('Payments', 'idx_payments_patient_createdAt');
    await queryInterface.removeIndex('Payments', 'idx_payments_status_createdAt');
    await queryInterface.removeIndex('MedicalRecords', 'idx_medical_records_patient_createdAt');
    await queryInterface.removeIndex('LabResults', 'idx_lab_results_patient_createdAt');
  }
};
