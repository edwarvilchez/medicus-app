const { Appointment, User, Doctor, Patient } = require('./src/models');
const sequelize = require('./src/config/db.config');

async function debugAppointments() {
  try {
    console.log('--- START DEBUG ---');
    
    // 1. Find User Ana
    const users = await User.findAll({
      where: sequelize.where(
        sequelize.fn('lower', sequelize.col('firstName')), 
        'ana'
      )
    });
    
    console.log(`Found ${users.length} users named Ana.`);
    for (const u of users) {
      console.log(`User: ${u.firstName} ${u.lastName} (ID: ${u.id}, Role: ${u.roleId})`);
      
      // Check if she is a Doctor
      const doctor = await Doctor.findOne({ where: { userId: u.id } });
      if (doctor) console.log(`  -> Is Doctor (ID: ${doctor.id})`);
      
      // Check if she is a Patient
      const patient = await Patient.findOne({ where: { userId: u.id } });
      if (patient) console.log(`  -> Is Patient (ID: ${patient.id})`);
    }

    // 2. Find Appointments for Feb 10, 2026
    const start = new Date('2026-02-10T00:00:00');
    const end = new Date('2026-02-10T23:59:59');
    
    // Note: Sequelize uses UTC by default, so we might need to be broad or check database timezone
    // Let's just list ALL appointments created in the last 24 hours to see what was just made.
    
    const recentAppointments = await Appointment.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
          { model: Doctor, include: [User] },
          { model: Patient, include: [User] }
      ]
    });
    
    console.log(`\nLast 5 Appointments Created:`);
    recentAppointments.forEach(a => {
        console.log(`ID: ${a.id}`);
        console.log(`Date: ${a.date}`);
        console.log(`Patient: ${a.Patient?.User?.firstName} (ID: ${a.patientId})`);
        console.log(`Doctor: ${a.Doctor?.User?.firstName} (ID: ${a.doctorId})`);
        console.log(`Status: ${a.status}`);
        console.log('---');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // await sequelize.close(); // Keep connection open or just exit
    process.exit();
  }
}

debugAppointments();
