const { User, Role } = require('./src/models');
const sequelize = require('./src/config/db.config');
const bcrypt = require('bcryptjs');

const DRY_RUN = process.argv.includes('--dry-run');
const DEFAULT_ROLE_NAME = 'PATIENT'; // Rol por defecto si falta
const DEFAULT_PASSWORD = 'ambio123'; // Password temporal si es necesario resetear

async function fixIntegrity() {
  const t = await sequelize.transaction();
  try {
    console.log(`Iniciando reparación de integridad de usuarios... (DRY_RUN: ${DRY_RUN})`);
    
    // Buscar rol por defecto
    const defaultRole = await Role.findOne({ where: { name: DEFAULT_ROLE_NAME } });
    if (!defaultRole) {
      throw new Error(`Rol por defecto '${DEFAULT_ROLE_NAME}' no encontrado en DB.`);
    }

    const users = await User.findAll({
      include: [Role],
      paranoid: false
    });

    console.log(`Analizando ${users.length} usuarios...`);
    let fixedCount = 0;

    for (const u of users) {
      let needsSave = false;
      let logMsg = `[ID: ${u.id}] ${u.email}:`;

      // 1. Reparar Rol Faltante
      if (!u.Role) {
        logMsg += `\n  - ⚠️ FALTA ROL. Asignando ${DEFAULT_ROLE_NAME}...`;
        if (!DRY_RUN) {
          u.roleId = defaultRole.id;
          needsSave = true;
        }
      }

      // 2. Reparar Password No Hasheado
      // Si el password NO empieza con $2a$ o $2b$ o tiene longitud < 50
      if (!u.password || u.password.length < 50 || !u.password.startsWith('$2')) {
        logMsg += `\n  - ⚠️ PASSWORD INVÁLIDO. Hasheando password actual...`;
        if (!DRY_RUN) {
          // Si tiene password plano, lo hasheamos. Si no tiene, asignamos default.
          const plainPassword = u.password || DEFAULT_PASSWORD;
          const salt = await bcrypt.genSalt(10);
          u.password = await bcrypt.hash(plainPassword, salt);
          needsSave = true;
          if (!u.password) logMsg += ` (Reseteado a '${DEFAULT_PASSWORD}')`;
        }
      }

      // 3. Activar usuario si estaba inactivo (opcional, comentar si no se desea)
      if (!u.isActive) {
         logMsg += `\n  - ℹ️ Usuario INACTIVO. (No se modifica accción)`;
         // u.isActive = true; needsSave = true; // Descomentar para activar
      }

      if (needsSave) {
        await u.save({ transaction: t });
        fixedCount++;
        console.log(logMsg);
        console.log('  ✅ REPARADO');
      } else if (logMsg.includes('⚠️')) {
        console.log(logMsg);
        console.log('  ℹ️ (DRY RUN - No se guardaron cambios)');
      }
    }

    await t.commit();
    console.log('--------------------------------------------------');
    console.log(`Proceso finalizado. Usuarios reparados: ${fixedCount}`);
    if (DRY_RUN) console.log('NOTA: Ejecuta el script sin --dry-run para aplicar los cambios.');

  } catch (err) {
    await t.rollback();
    console.error('Error crítico durante la reparación:', err);
  } finally {
    process.exit();
  }
}

fixIntegrity();
