const { User, Role } = require('./src/models');
require('dotenv').config();
const sequelize = require('./src/config/db.config');

const listAllUsers = async () => {
  try {
    await sequelize.authenticate();
    const users = await User.findAll({ include: [Role] });
    console.log(`Total users: ${users.length}`);
    users.slice(0, 10).forEach(u => {
      console.log(`- ${u.email} (${u.username}) [${u.Role ? u.Role.name : 'NO ROLE'}]`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

listAllUsers();
