const { MedicalRecord, Appointment } = require('./src/models');
const sequelize = require('./src/config/db.config');

async function seedRecord() {
  try {
    const patientId = 'ae46b60b-4001-4883-b436-df3d4d644373';
    const doctorId = '3542772f-5000-4938-89db-9a5f09a40874';

    await MedicalRecord.create({
      patientId,
      doctorId,
      diagnosis: 'Gripe Común y cansancio',
      physicalExam: 'Fiebre de 38.5, congestión nasal moderada.',
      treatment: 'Paracetamol 500mg cada 8 horas por 3 días.',
      indications: 'Mucho reposo e hidratación. Evitar cambios bruscos de temperatura.',
      medicalLeaveDays: 3,
      medicalLeaveStartDate: new Date(),
      medicalLeaveEndDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    });

    console.log('Sample medical record created for Eduardo Serrano.');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

seedRecord();
