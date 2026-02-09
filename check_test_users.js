const { User } = require('./server/src/models');
const sequelize = require('./server/src/config/db.config');

async function checkUsers() {
  try {
    const users = await User.findAll({
      where: {
        email: [
          'dr.mendez@medicus.com',
          'contacto@saludexpress.com',
          'admin@hgc.com'
        ]
      },
      attributes: ['id', 'email', 'accountType', 'businessName']
    });
    console.log('--- USERS FOUND ---');
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Error checking users:', error);
    process.exit(1);
  }
}

checkUsers();
