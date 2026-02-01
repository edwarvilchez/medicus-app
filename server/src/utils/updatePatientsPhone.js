const { Patient } = require('../models');

async function updatePatientsWithPhone() {
  try {
    const patients = await Patient.findAll();
    
    console.log(`Actualizando ${patients.length} pacientes con números de teléfono...`);
    
    for (let i = 0; i < patients.length; i++) {
      const patient = patients[i];
      if (!patient.phone) {
        // Generate a sample Venezuelan phone number
        const phoneNumber = `+58424${Math.floor(1000000 + Math.random() * 9000000)}`;
        await patient.update({ phone: phoneNumber });
        console.log(`✓ Paciente ${i + 1}: ${phoneNumber}`);
      } else {
        console.log(`✓ Paciente ${i + 1}: Ya tiene teléfono (${patient.phone})`);
      }
    }
    
    console.log('\n✅ Actualización completada!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updatePatientsWithPhone();
