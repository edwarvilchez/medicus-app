const { User, Role, Doctor, Nurse, Staff, Patient, Organization, Specialty, sequelize } = require('./src/models');
const seedRoles = require('./src/utils/seeder');

async function seedProductionTests() {
  const transaction = await sequelize.transaction();
  try {
    console.log('🚀 Iniciando seeding de usuarios para pruebas en producción...');

    // 1. Asegurar Roles
    await seedRoles();
    const roles = await Role.findAll();
    const getRoleId = (name) => roles.find(r => r.name === name).id;

    // Password estándar para pruebas
    const testPassword = process.env.TEST_PASSWORD || 'MedicusTest2026!';

    // 2. Crear Organización de Prueba (SaaS)
    const [org] = await Organization.findOrCreate({
      where: { name: 'Hospital de Pruebas Medicus' },
      defaults: {
        name: 'Hospital de Pruebas Medicus',
        type: 'HOSPITAL',
      },
      transaction
    });

    const testUsers = [
      {
        username: 'prod.admin',
        email: 'admin@prod-medicus.com',
        password: testPassword,
        firstName: 'Admin',
        lastName: 'Producción',
        role: 'SUPERADMIN',
        accountType: 'HOSPITAL'
      },
      {
        username: 'prod.hgc',
        email: 'hgc.admin@prod-medicus.com',
        password: testPassword,
        firstName: 'Director',
        lastName: 'HGC',
        role: 'ADMINISTRATIVE',
        accountType: 'HOSPITAL',
        orgId: org.id
      },
      {
        username: 'prod.doctor',
        email: 'dr.test@prod-medicus.com',
        password: testPassword,
        firstName: 'Carlos',
        lastName: 'Prueba',
        role: 'DOCTOR',
        accountType: 'PROFESSIONAL',
        orgId: org.id
      },
      {
        username: 'prod.nurse',
        email: 'nurse.test@prod-medicus.com',
        password: testPassword,
        firstName: 'Ana',
        lastName: 'Enfermera',
        role: 'NURSE',
        accountType: 'HOSPITAL',
        orgId: org.id
      },
      {
        username: 'prod.patient',
        email: 'paciente.test@prod-medicus.com',
        password: testPassword,
        firstName: 'Juan',
        lastName: 'Paciente',
        role: 'PATIENT',
        accountType: 'PATIENT'
      },
      {
        username: 'prod.recep',
        email: 'recep.test@prod-medicus.com',
        password: testPassword,
        firstName: 'Maria',
        lastName: 'Recepcionista',
        role: 'RECEPTIONIST',
        accountType: 'HOSPITAL',
        orgId: org.id
      }
    ];

    for (const u of testUsers) {
      console.log(`- Procesando ${u.role}: ${u.email}...`);
      const [user, created] = await User.findOrCreate({
        where: { email: u.email },
        defaults: {
          username: u.username,
          email: u.email,
          password: u.password,
          firstName: u.firstName,
          lastName: u.lastName,
          roleId: getRoleId(u.role),
          accountType: u.accountType,
          organizationId: u.orgId
        },
        transaction
      });

      if (!created) {
        user.password = u.password; // Actualizar password si ya existe
        await user.save({ transaction });
        console.log(`  (Actualizado password para usuario existente)`);
      }

      // Crear Perfiles específicos
      if (u.role === 'DOCTOR') {
        await Doctor.findOrCreate({
          where: { userId: user.id },
          defaults: { userId: user.id, licenseNumber: 'PROD-DOC-001', phone: '+58412-0000001' },
          transaction
        });
      } else if (u.role === 'NURSE') {
        await Nurse.findOrCreate({
          where: { userId: user.id },
          defaults: { userId: user.id, licenseNumber: 'PROD-NUR-001', shift: 'Mañana' },
          transaction
        });
      } else if (u.role === 'RECEPTIONIST' || u.role === 'ADMINISTRATIVE') {
        await Staff.findOrCreate({
          where: { userId: user.id },
          defaults: { userId: user.id, employeeId: `EMP-${u.role.substring(0,3)}`, position: u.role },
          transaction
        });
      } else if (u.role === 'PATIENT') {
        await Patient.findOrCreate({
          where: { userId: user.id },
          defaults: { userId: user.id, documentId: 'V-00000001', phone: '+58412-0000002' },
          transaction
        });
      }
    }

    await transaction.commit();
    console.log('\n✅ Seeding completado con éxito.');
    console.log('Credenciales sugeridas para todas las cuentas: ' + testPassword);
    
    process.exit(0);
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('❌ Error en el seeding:', error);
    process.exit(1);
  }
}

seedProductionTests();
