const { Doctor, Specialty } = require('../models');

async function fixDoctorSpecialties() {
  try {
    console.log('🔧 Reparando especialidades de doctores...');

    const doctors = await Doctor.findAll();
    const specialties = await Specialty.findAll();

    if (specialties.length === 0) {
      console.log('❌ No hay especialidades. Ejecuta seedSpecialties.js primero.');
      return;
    }

    for (let i = 0; i < doctors.length; i++) {
      const doc = doctors[i];
      // Asignar especialidad secuencialmente o aleatoriamente
      const specialty = specialties[i % specialties.length];
      
      await doc.update({ specialtyId: specialty.id });
      console.log(`✅ Doctor ${doc.id} actualizado con ${specialty.name}`);
    }

    console.log('🎉 Reparación completada.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error reparando datos:', error);
    process.exit(1);
  }
}

fixDoctorSpecialties();
