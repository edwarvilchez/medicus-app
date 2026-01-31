const { Client } = require('pg');
require('dotenv').config();

const grantPermissions = async () => {
  const client = new Client({
    user: 'postgres',
    password: '472025',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    database: 'postgres'
  });

  const envs = ['medicus_dev', 'medicus_qa', 'medicus_prod'];
  const appUser = 'medicus_app_admin';

  try {
    await client.connect();
    console.log('✅ Conectado a PostgreSQL\n');

    for (const dbName of envs) {
      console.log(`📊 Configurando permisos para: ${dbName}`);
      
      // Connect to the specific database
      const dbClient = new Client({
        user: 'postgres',
        password: '472025',
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 5432,
        database: dbName
      });

      await dbClient.connect();
      
      // Grant schema permissions
      await dbClient.query(`GRANT ALL ON SCHEMA public TO ${appUser}`);
      await dbClient.query(`GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${appUser}`);
      await dbClient.query(`GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${appUser}`);
      await dbClient.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${appUser}`);
      await dbClient.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${appUser}`);
      
      console.log(`   ✅ Permisos otorgados correctamente\n`);
      
      await dbClient.end();
    }

    console.log('--- ✅ Todos los permisos configurados ---');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
};

grantPermissions();
