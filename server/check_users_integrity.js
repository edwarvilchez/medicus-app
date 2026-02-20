const { User, Role } = require('./src/models');
const sequelize = require('./src/config/db.config');

async function checkIntegrity() {
  try {
    console.log('Iniciando chequeo de integridad de usuarios...');
    
    const users = await User.findAll({
      include: [Role],
      paranoid: false // Incluir usuarios borrados para diagnóstico completo
    });

    console.log(`Total de usuarios encontrados: ${users.length}`);
    console.log('--------------------------------------------------');

    let issuesFound = 0;

    users.forEach(u => {
      let issues = [];

      // Chequeo 1: Rol
      if (!u.Role) {
        issues.push(`FALTA ROL (roleId: ${u.roleId})`);
      }

      // Chequeo 2: Password Hash (Bcrypt starts with $2a$ or $2b$ and is 60 chars long)
      if (!u.password || u.password.length < 50 || !u.password.startsWith('$2')) {
        issues.push('PASSWORD NO HASHEADO O IVÁLIDO');
      }

      // Chequeo 3: Estado
      if (!u.isActive) {
        issues.push('USUARIO INACTIVO');
      }

      // Chequeo 4: Borrado lógico
      if (u.deletedAt) {
        issues.push('USUARIO BORRADO (Soft Deleted)');
      }

      if (issues.length > 0) {
        console.log(`[ID: ${u.id}] ${u.email} (${u.username}):`);
        issues.forEach(i => console.log(`  - ❌ ${i}`));
        issuesFound++;
      }
    });

    if (issuesFound === 0) {
      console.log('✅ No se encontraron problemas evidentes de integridad en los usuarios.');
    } else {
      console.log('--------------------------------------------------');
      console.log(`⚠️ Se encontraron problemas en ${issuesFound} usuarios.`);
    }

  } catch (err) {
    console.error('Error durante el chequeo:', err);
  } finally {
    process.exit(); 
  }
}

checkIntegrity();
