const { Client } = require('pg');
require('dotenv').config();

const createSchemas = async () => {
  // Connect as postgres superuser to create databases
  const client = new Client({
    user: 'postgres', // Using postgres superuser
    password: '472025', // Your postgres password
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    database: 'postgres'
  });

  const envs = ['medicus_dev', 'medicus_qa', 'medicus_prod'];
  const appUser = 'medicus_app_admin';
  const appPassword = '472025';

  try {
    await client.connect();
    console.log('✅ Conectado a PostgreSQL como superusuario');
    console.log('--- Iniciando configuración de ambientes ---\n');

    // Create application user if it doesn't exist
    const userExists = await client.query(
      `SELECT 1 FROM pg_roles WHERE rolname = $1`,
      [appUser]
    );

    if (userExists.rowCount === 0) {
      await client.query(
        `CREATE USER ${appUser} WITH PASSWORD '${appPassword}'`
      );
      console.log(`✅ Usuario '${appUser}' creado exitosamente.\n`);
    } else {
      console.log(`ℹ️  Usuario '${appUser}' ya existe.\n`);
    }

    // Create databases
    for (const dbName of envs) {
      // Check if db exists
      const res = await client.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [dbName]
      );
      
      if (res.rowCount === 0) {
        await client.query(`CREATE DATABASE ${dbName}`);
        console.log(`✅ Base de datos '${dbName}' creada exitosamente.`);
        
        // Grant privileges to medicus_app_db user
        await client.query(`GRANT ALL PRIVILEGES ON DATABASE ${dbName} TO ${appUser}`);
        console.log(`   → Permisos otorgados a '${appUser}'`);
      } else {
        console.log(`ℹ️  La base de datos '${dbName}' ya existe.`);
        // Grant privileges anyway in case they weren't set
        await client.query(`GRANT ALL PRIVILEGES ON DATABASE ${dbName} TO ${appUser}`);
        console.log(`   → Permisos verificados para '${appUser}'`);
      }
    }

    console.log('\n--- ✅ Proceso completado exitosamente ---');
    console.log('\n📊 Configuración de ambientes:');
    console.log('  • medicus_dev  → Desarrollo (NODE_ENV=development)');
    console.log('  • medicus_qa   → QA/Testing (NODE_ENV=qa)');
    console.log('  • medicus_prod → Producción (NODE_ENV=production)');
    console.log(`\n👤 Usuario de aplicación: ${appUser}`);
    console.log('\n💡 Para cambiar de ambiente, modifica NODE_ENV en tu .env');
    
  } catch (err) {
    console.error('❌ Error en la configuración:', err.message);
    console.error('\nSugerencias:');
    console.error('  1. Verifica que PostgreSQL esté corriendo');
    console.error('  2. Confirma la contraseña del usuario postgres');
    console.error('  3. Asegúrate de tener permisos de superusuario');
  } finally {
    await client.end();
  }
};

createSchemas();
