const { User, Role, Doctor, Patient, Appointment } = require('./src/models');
const { sequelize } = require('./src/models');

async function checkUser() {
  try {
    const email = 'dr.rodriguez@medicus.com';
    const user = await User.findOne({
      where: { email },
      include: [Role]
    });

    if (!user) {
      console.log(`User with email ${email} not found.`);
      return;
    }

    console.log('User Details:');
    console.log(`ID: ${user.id}`);
    console.log(`Name: ${user.firstName} ${user.lastName}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role ID: ${user.roleId}`);
    console.log(`Role Name: ${user.Role ? user.Role.name : 'N/A'}`);

    const doctor = await Doctor.findOne({ where: { userId: user.id } });
    if (doctor) {
      console.log('User is a Doctor.');
      console.log(`Doctor ID: ${doctor.id}`);
    } else {
      console.log('User is NOT a Doctor profile.');
    }

    const patient = await Patient.findOne({ where: { userId: user.id } });
    if (patient) {
      console.log('User is a Patient.');
      console.log(`Patient ID: ${patient.id}`);
    } else {
        console.log('User is NOT a Patient profile.');
    }

    // Check recent appointments for this doctor
    if (doctor) {
        const appointments = await Appointment.findAll({
            where: { doctorId: doctor.id },
            limit: 5,
            order: [['date', 'DESC']]
        });
        console.log(`Found ${appointments.length} appointments for this doctor.`);
        appointments.forEach(a => console.log(` - ${a.date} (Status: ${a.status})`));
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

checkUser();
