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

    // 2. Crear SuperAdmin primero para que sea el dueño de la organización
    const adminData = {
      username: 'prod.admin',
      email: 'admin@prod-medicus.com',
      password: testPassword,
      firstName: 'Admin',
      lastName: 'Producción',
      role: 'SUPERADMIN',
      accountType: 'HOSPITAL'
    };

    const [adminUser, adminCreated] = await User.findOrCreate({
      where: { email: adminData.email },
      defaults: {
        username: adminData.username,
        email: adminData.email,
        password: adminData.password, // El hook del modelo lo hasheará
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        accountType: adminData.accountType,
        roleId: getRoleId(adminData.role)
      },
      transaction
    });

    if (!adminCreated) {
      await adminUser.update({ password: adminData.password }, { transaction });
      console.log(`- Admin existente actualizado.`);
    } else {
      console.log(`- Admin creado.`);
    }

    // 3. Crear Organización de Prueba (SaaS) usando al Admin como dueño
    const [org] = await Organization.findOrCreate({
      where: { name: 'Hospital de Pruebas Medicus' },
      defaults: {
        name: 'Hospital de Pruebas Medicus',
        type: 'HOSPITAL',
        ownerId: adminUser.id
      },
      transaction
    });

    const testUsers = [
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
          password: u.password, // El hook del modelo lo hasheará
          firstName: u.firstName,
          lastName: u.lastName,
          roleId: getRoleId(u.role),
          accountType: u.accountType,
          organizationId: u.orgId
        },
        transaction
      });

      if (!created) {
        await user.update({ password: u.password }, { transaction });
        console.log(`  (Actualizado password para usuario existente)`);
      }

      // Crear o Actualizar Perfiles específicos
      if (u.role === 'DOCTOR') {
        const [doc] = await Doctor.findOrCreate({
          where: { userId: user.id },
          defaults: { userId: user.id, licenseNumber: 'PROD-DOC-001', phone: '+58412-0000001' },
          transaction
        });
        if (doc) {
          doc.licenseNumber = 'PROD-DOC-001';
          await doc.save({ transaction });
        }
      } else if (u.role === 'NURSE') {
        const [nur] = await Nurse.findOrCreate({
          where: { userId: user.id },
          defaults: { userId: user.id, licenseNumber: 'PROD-NUR-001', shift: 'Morning' },
          transaction
        });
        if (nur) {
          nur.licenseNumber = 'PROD-NUR-001';
          nur.shift = 'Morning';
          await nur.save({ transaction });
        }
      } else if (u.role === 'RECEPTIONIST' || u.role === 'ADMINISTRATIVE') {
        const [st] = await Staff.findOrCreate({
          where: { userId: user.id },
          defaults: { userId: user.id, employeeId: `EMP-${u.role.substring(0,3)}`, position: u.role },
          transaction
        });
        if (st) {
          st.position = u.role;
          await st.save({ transaction });
        }
      } else if (u.role === 'PATIENT') {
        const [pat] = await Patient.findOrCreate({
          where: { userId: user.id },
          defaults: { userId: user.id, documentId: 'V-00000001', phone: '+58412-0000002' },
          transaction
        });
        if (pat) {
          pat.documentId = 'V-00000001';
          await pat.save({ transaction });
        }
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
