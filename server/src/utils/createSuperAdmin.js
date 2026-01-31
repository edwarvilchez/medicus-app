const { User, Role } = require('../models');
const bcrypt = require('bcryptjs');

async function createSuperAdmin() {
  try {
    console.log('🔐 Verificando SUPERADMIN...\n');

    // Check if superadmin already exists
    const existingSuperAdmin = await User.findOne({ 
      where: { email: 'admin@medicus.com' } 
    });

    if (existingSuperAdmin) {
      console.log('ℹ️  SUPERADMIN ya existe:');
      console.log('   Email: admin@medicus.com');
      console.log('   Username: superadmin');
      console.log('   Password: admin123 (si no ha sido cambiado)\n');
      console.log('✅ No se requiere acción.\n');
      process.exit(0);
    }

    // Get SUPERADMIN role
    const superAdminRole = await Role.findOne({ where: { name: 'SUPERADMIN' } });
    
    if (!superAdminRole) {
      console.log('❌ Error: El rol SUPERADMIN no existe en la base de datos.');
      console.log('   Ejecuta primero: node src/utils/seeder.js\n');
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create SUPERADMIN user
    const superAdmin = await User.create({
      username: 'superadmin',
      email: 'admin@medicus.com',
      password: hashedPassword,
      firstName: 'Administrador',
      lastName: 'Sistema',
      phone: '+58412-0000000',
      roleId: superAdminRole.id
    });

    console.log('✅ SUPERADMIN creado exitosamente!\n');
    console.log('┌────────────────────────────────────────────────────────┐');
    console.log('│              CREDENCIALES SUPERADMIN                   │');
    console.log('├────────────────────────────────────────────────────────┤');
    console.log('│ Email:    admin@medicus.com                            │');
    console.log('│ Username: superadmin                                   │');
    console.log('│ Password: admin123                                     │');
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
