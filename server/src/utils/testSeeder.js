const { Role, User, Patient, Doctor, Specialty, Department } = require('../models');

const seedTestData = async () => {
  try {
    // 1. Ensure Roles
    const superAdminRole = await Role.findOne({ where: { name: 'SUPERADMIN' } });
    const doctorRole = await Role.findOne({ where: { name: 'DOCTOR' } });
    const patientRole = await Role.findOne({ where: { name: 'PATIENT' } });
    
    if (!patientRole) {
        await Role.findOrCreate({ where: { name: 'PATIENT' }, defaults: { name: 'PATIENT', description: 'Paciente del sistema' } });
    }

    // Create SUPERADMIN user
    const [adminUser] = await User.findOrCreate({
      where: { username: 'superadmin' },
      defaults: {
        username: 'superadmin',
        email: 'admin@medicus.com',
        password: 'admin123',
        firstName: 'Super',
        lastName: 'Admin',
        roleId: superAdminRole.id
      }
    });
    console.log('✅ SUPERADMIN created: admin@medicus.com / admin123');

    // 2. Create Specialty and Department
    const [dept] = await Department.findOrCreate({ where: { name: 'Cardiología' }, defaults: { name: 'Cardiología' } });
    const [spec] = await Specialty.findOrCreate({ where: { name: 'Cardiología Clínica', departmentId: dept.id }, defaults: { name: 'Cardiología Clínica', departmentId: dept.id } });

    // 3. Create a Doctor
    const [docUser] = await User.findOrCreate({
      where: { username: 'dr_gomez' },
      defaults: {
        username: 'dr_gomez',
        email: 'gomez@medicus.com',
        password: 'password123',
        firstName: 'Alberto',
        lastName: 'Gomez',
        roleId: doctorRole.id
      }
    });

    await Doctor.findOrCreate({
      where: { userId: docUser.id },
      defaults: {
        userId: docUser.id,
        licenseNumber: 'DOC-12345',
        phone: '+584120001122',
        specialtyId: spec.id
      }
    });

    // 4. Create a Patient
    const [patUser] = await User.findOrCreate({
      where: { username: 'cruiz' },
      defaults: {
        username: 'cruiz',
        email: 'cruiz@gmail.com',
        password: 'password123',
        firstName: 'Carlos',
        lastName: 'Ruiz',
        roleId: (await Role.findOne({where:{name:'PATIENT'}}))?.id
      }
    });

    await Patient.findOrCreate({
      where: { userId: patUser.id },
      defaults: {
        userId: patUser.id,
        documentId: 'V-12345678',
        phone: '+584125556677',
        gender: 'Male'
      }
    });

    console.log('Test data seeded successfully');
  } catch (error) {
    console.error('Error seeding test data:', error);
  }
};

module.exports = seedTestData;
