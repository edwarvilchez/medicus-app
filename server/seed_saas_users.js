const { User, Role, Organization, Doctor, Staff, sequelize } = require('./src/models');

const saasUsers = [
  {
    type: 'HOSPITAL',
    email: 'admin@hgc.com',
    password: process.env.SEED_USER_PASSWORD || 'hospital123',
    username: 'hgc.admin',
    firstName: 'Dirección',
    lastName: 'HGC',
    businessName: 'Hospital General del Centro',
    roleName: 'ADMINISTRATIVE'
  },
  {
    type: 'CLINIC',
    email: 'contacto@saludexpress.com',
    password: process.env.SEED_USER_PASSWORD || 'clinica123',
    username: 'clinica.salud',
    firstName: 'Admin',
    lastName: 'SaludExpress',
    businessName: 'Centro Médico Salud Express',
    roleName: 'ADMINISTRATIVE'
  },
  {
    type: 'PROFESSIONAL',
    email: 'dr.mendez@medicus.com',
    password: process.env.SEED_USER_PASSWORD || 'doctor123',
    username: 'dr.mendez',
    firstName: 'Javier',
    lastName: 'Méndez',
    businessName: 'Dr. Javier Méndez',
    roleName: 'DOCTOR'
  }
];

async function seed() {
  const t = await sequelize.transaction();
  try {
    console.log('🔄 Seeding SaaS Users & Organizations...');

    // 1. Get Roles
    const adminRole = await Role.findOne({ where: { name: 'ADMINISTRATIVE' } });
    const doctorRole = await Role.findOne({ where: { name: 'DOCTOR' } });

    if (!adminRole || !doctorRole) {
      throw new Error('❌ Roles not found. Run basic seeder first.');
    }

    for (const data of saasUsers) {
      console.log(`Processing ${data.email}...`);

      // 2. Cleanup Existing (User + Org due to logic, but let's be safe)
      const existingUser = await User.findOne({ where: { email: data.email } });
      
      if (existingUser) {
        console.log(`⚠️ User exists. Deleting user (assuming cascade or manual cleanup)...`);
        // We delete from DB to recreate fresh
        await User.destroy({ where: { id: existingUser.id }, force: true, transaction: t });
        // Also ensure any Org owned by this ID is gone (though User ID changes, so previous Org might be orphan if not cascaded)
        // Let's find Org by name to be safe
        await Organization.destroy({ where: { name: data.businessName }, transaction: t });
      }

      // 3. Create User (Pasando password plain text para que el hook lo hashee)
      const roleId = data.roleName === 'DOCTOR' ? doctorRole.id : adminRole.id;
      
      const newUser = await User.create({
        username: data.username,
        email: data.email,
        password: data.password, // Plain text, hook will hash
        firstName: data.firstName,
        lastName: data.lastName,
        businessName: data.businessName,
        accountType: data.type,
        roleId: roleId,
        gender: 'Other' // Default
      }, { transaction: t });

      // 4. Create Organization
      const newOrg = await Organization.create({
        name: data.businessName,
        type: data.type,
        ownerId: newUser.id
      }, { transaction: t });

      // 5. Link User to Org
      await newUser.update({ organizationId: newOrg.id }, { transaction: t });

      // 6. Create Profile (Doctor/Staff)
      if (data.roleName === 'DOCTOR') {
        const existingDoc = await Doctor.findOne({ where: { userId: newUser.id } }); // Should be null
        if (!existingDoc) {
             await Doctor.create({
                userId: newUser.id,
                licenseNumber: 'SAAS-DOC-' + Date.now(),
                specialtyId: 1 // Default or verify exists
             }, { transaction: t });
        }
      } else if (data.roleName === 'ADMINISTRATIVE') {
         await Staff.create({
            userId: newUser.id,
            departmentName: 'Direccion',
            position: 'Director'
         }, { transaction: t });
      }

      console.log(`✅ Created ${data.type} user: ${data.email}`);
    }

    await t.commit();
    console.log('🎉 Seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    await t.rollback();
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
