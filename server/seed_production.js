/**
 * Script de Seeding para Producción
 * 
 * Este script debe ejecutarse SOLO en el servidor de producción
 * con las credenciales proporcionadas de forma segura (variables de entorno)
 * 
 * Uso:
 *   node seed_production.js
 * 
 * Variables de entorno requeridas:
 *   TEST_PASSWORD - Contraseña para usuarios de prueba
 */

require('dotenv').config();
const { sequelize } = require('./src/models');
// CORRECCIÓN: Importar las funciones directamente (sin destructuring)
const seedRoles = require('./src/utils/seeder'); 
const seedTestUsers = require('./src/utils/testSeeder');

async function runProductionSeed() {
  try {
    console.log('🌱 Iniciando seeding de producción...\n');

    // Verificar que estamos en producción
    if (process.env.NODE_ENV !== 'production') {
      console.warn('⚠️  ADVERTENCIA: Este script está diseñado para producción.');
      console.warn('   NODE_ENV actual:', process.env.NODE_ENV);
      console.log('\n¿Desea continuar de todos modos? (Presione Ctrl+C para cancelar)');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a base de datos establecida\n');

    // 1. Seed de roles (siempre necesario)
    console.log('📋 Seeding roles del sistema...');
    await seedRoles();
    console.log('✅ Roles creados correctamente\n');

    // 2. Seed de usuarios de prueba (opcional)
    // El script testSeeder crea al SUPERADMIN 'admin' además de otros usuarios
    const shouldSeedTestUsers = process.env.SEED_TEST_USERS === 'true';
    
    if (shouldSeedTestUsers) {
      console.log('👥 Seeding usuarios del sistema (Admin + Pruebas)...');
      
      if (!process.env.TEST_PASSWORD) {
        throw new Error('TEST_PASSWORD no está definido en las variables de entorno');
      }
      console.log('🔑 Usando contraseña segura definida en entorno');

      await seedTestUsers();
      console.log('✅ Usuarios creados correctamente\n');
    } else {
      console.log('⏭️  Saltando creación de usuarios (SEED_TEST_USERS no está en true)');
      console.log('⚠️  Asegúrese de tener al menos un usuario administrador creado manualmente.\n');
    }

    console.log('🎉 Seeding de producción completado exitosamente!');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error durante el seeding:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Ejecutar
runProductionSeed();
