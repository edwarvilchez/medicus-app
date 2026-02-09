const sequelize = require('./src/config/db.config');

async function checkSchema() {
  try {
    const [results] = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'VideoConsultations';
    `);
    console.log('--- VideoConsultations ---');
    console.table(results);

    const [results2] = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Appointments';
    `);
    console.log('--- Appointments ---');
    console.table(results2);

    const [results3] = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Patients';
    `);
    console.log('--- Patients ---');
    console.table(results3);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkSchema();
