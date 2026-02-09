const { MedicalRecord, Patient, User, LabResult } = require('./src/models');
const sequelize = require('./src/config/db.config');

async function debugMedicalHistory() {
  try {
    const user = await User.findOne({ where: { firstName: 'eduardo', lastName: 'serrano' } });
    if (!user) {
      console.log('User Eduardo Serrano not found');
      return;
    }

    const patient = await Patient.findOne({ where: { userId: user.id } });
    if (!patient) {
        console.log('Patient profile for Eduardo Serrano not found');
        return;
    }

    console.log(`Patient: ${user.firstName} ${user.lastName} (ID: ${patient.id})`);

    const records = await MedicalRecord.findAll({ where: { patientId: patient.id } });
    console.log(`Found ${records.length} medical records.`);
    records.forEach(r => console.log(` - ${r.createdAt}: ${r.diagnosis}`));

    const labs = await LabResult.findAll({ where: { patientId: patient.id } });
    console.log(`Found ${labs.length} lab results.`);
    labs.forEach(l => console.log(` - ${l.createdAt}: ${l.examType}`));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

debugMedicalHistory();
