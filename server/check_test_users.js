const { User } = require('./src/models');
const sequelize = require('./src/config/db.config');

async function checkUsers() {
  try {
    const users = await User.findAll({
      limit: 20,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'email', 'username', 'accountType', 'businessName', 'createdAt']
    });
    console.log('--- RECENT USERS ---');
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Error checking users:', error);
    process.exit(1);
  }
}

checkUsers();
