const { User, Role } = require('../models');
const bcrypt = require('bcryptjs');

async function createSuperAdmin() {
  try {
    console.log('🔐 Verificando SUPERADMIN...\n');

    // Check if superadmin already exists
    let superAdmin = await User.findOne({ 
      where: { email: 'admin@medicus.com' } 
    });

    if (superAdmin) {
      console.log('ℹ️  SUPERADMIN ya existe. Actualizando password...');
      superAdmin.password = process.env.SUPERADMIN_PASSWORD || 'admin123';
      await superAdmin.save();
      console.log('✅ Password actualizado.');
    } else {
        // Get SUPERADMIN role
        const superAdminRole = await Role.findOne({ where: { name: 'SUPERADMIN' } });
        
        if (!superAdminRole) {
          console.log('❌ Error: El rol SUPERADMIN no existe en la base de datos.');
          console.log('   Ejecuta primero: node src/utils/seeder.js\n');
          process.exit(1);
        }

        // Create SUPERADMIN user (hooks will hash password)
        superAdmin = await User.create({
          username: 'superadmin',
          email: 'admin@medicus.com',
          password: process.env.SUPERADMIN_PASSWORD || 'admin123',
          firstName: 'Administrador',
          lastName: 'Sistema',
          phone: '+58412-0000000',
          roleId: superAdminRole.id
        });
        
        console.log('✅ SUPERADMIN creado exitosamente!\n');
    }
    console.log('┌────────────────────────────────────────────────────────┐');
    console.log('│              CREDENCIALES SUPERADMIN                   │');
    console.log('├────────────────────────────────────────────────────────┤');
    console.log('│ Email:    admin@medicus.com                            │');
    console.log('│ Username: superadmin                                   │');
    console.log('│ Password: [PROTEGIDO] (Ver variable SUPERADMIN_PASSWORD)     │');
    console.log('│ Nombre:   Administrador Sistema                        │');
    console.log('└────────────────────────────────────────────────────────┘\n');
    console.log('⚠️  IMPORTANTE: Cambia esta contraseña en producción!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear SUPERADMIN:', error.message);
    process.exit(1);
  }
}

createSuperAdmin();
