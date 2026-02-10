const { User, Doctor, Patient, Appointment } = require('../models');
const { Op } = require('sequelize');

const seedVideoReadyAppointment = async () => {
  try {
    console.log('🌱 Seeding video-ready appointment...');

    // 1. Find or Create Doctor (Dr. Méndez)
    const [doctorUser] = await User.findOrCreate({ 
      where: { email: 'dr.mendez@medicus.com' },
      defaults: {
        username: 'dr.mendez',
        password: 'doctor123',
        firstName: 'Javier',
        lastName: 'Méndez',
        roleId: 2, // Assuming 2 is DOCTOR
        accountType: 'PROFESSIONAL'
      }
    });

    let doctorProfile = await Doctor.findOne({ where: { userId: doctorUser.id } });
    if (!doctorProfile) {
        // Create Doctor Profile
        doctorProfile = await Doctor.create({
            userId: doctorUser.id,
            licenseNumber: 'MED-777-TEST',
            phone: '+58414-9998877'
        });
    }

    // 2. Find or Create Patient (Juan González)
    const [patientUser] = await User.findOrCreate({ 
      where: { email: 'pac.gonzalez@email.com' },
       defaults: {
        username: 'pac.gonzalez',
        password: 'patient123',
        firstName: 'Juan',
        lastName: 'González',
        roleId: 3, // Assuming 3 is PATIENT
        accountType: 'PATIENT'
      }
    });

    let patientProfile = await Patient.findOne({ where: { userId: patientUser.id } });
    if (!patientProfile) {
        patientProfile = await Patient.create({
            userId: patientUser.id,
            documentId: 'V-11111111',
            phone: '+58424-1111111',
            gender: 'Male'
        });
    }

    // 3. Create Appointment for TODAY
    const today = new Date();
    today.setHours(today.getHours() + 1); // 1 hour from now
    today.setMinutes(0, 0, 0);

    const [appointment, created] = await Appointment.findOrCreate({
      where: {
        doctorId: doctorProfile.id,
        patientId: patientProfile.id,
        date: today,
        status: 'Confirmed'
      },
      defaults: {
        doctorId: doctorProfile.id,
        patientId: patientProfile.id,
        date: today,
        reason: 'Consulta de Seguimiento (Video)',
        status: 'Confirmed',
        type: 'Video',
        notes: 'Cita generada automáticamente para pruebas de videoconsulta.'
      }
    });

    console.log(`✅ Appointment ${created ? 'created' : 'found'}:`);
    console.log(`   ID: ${appointment.id}`);
    console.log(`   Date: ${appointment.date}`);
    console.log(`   Doctor: ${doctorUser.firstName} ${doctorUser.lastName}`);
    console.log(`   Patient: ${patientUser.firstName} ${patientUser.lastName}`);
    console.log(`   Type: ${appointment.type}`);
    console.log(`   Status: ${appointment.status}`);

    console.log('\n🔐 Test Credentials:');
    console.log('   Doctor: dr.mendez@medicus.com / doctor123');
    console.log('   Patient: pac.gonzalez@email.com / patient123');

  } catch (error) {
    console.error('❌ Error seeding appointment:', error);
  }
};

// Execute if run directly
if (require.main === module) {
  require('dotenv').config(); // Load .env if running directly
  const sequelize = require('../config/db.config');
  
  sequelize.authenticate()
    .then(() => {
        seedVideoReadyAppointment().then(() => {
            process.exit(0);
        });
    })
    .catch(err => {
        console.error('Database connection error:', err);
        process.exit(1);
    });
} else {
  module.exports = seedVideoReadyAppointment;
}
