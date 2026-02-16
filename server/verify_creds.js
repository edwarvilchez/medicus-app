const { User, Role } = require('./src/models');
const bcrypt = require('bcryptjs');

async function verifyCredentials() {
  const email = 'admin@prod-medicus.com';
  const password = process.env.TEST_PASSWORD || 'MedicusTest2026!';
  
  console.log(`🔍 Verificando credenciales para: ${email}`);
  
  try {
    const user = await User.findOne({ 
      where: { email },
      include: [Role]
    });
    
    if (!user) {
      console.log('❌ Error: Usuario no encontrado en la base de datos.');
      process.exit(1);
    }
    
    console.log(`✅ Usuario encontrado (ID: ${user.id})`);
    console.log(`👤 Rol: ${user.Role ? user.Role.name : 'NINGUNO'}`);
    
    const isMatch = await user.comparePassword(password);
    
    if (isMatch) {
      console.log('🎉 ¡ÉXITO! La contraseña coincide correctamente.');
    } else {
      console.log('❌ ERROR: La contraseña NO coincide.');
      // Depuración del hash (solo longitud y prefijo)
      console.log(`Hash almacenado empieza por: ${user.password.substring(0, 7)}... (Longitud: ${user.password.length})`);
    }
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  }
  process.exit(0);
}

verifyCredentials();
