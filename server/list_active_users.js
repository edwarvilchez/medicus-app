const { User, Role } = require('./src/models');
const sequelize = require('./src/config/db.config');

async function listActiveUsers() {
  try {
    const users = await User.findAll({
      where: { isActive: true },
      include: [Role],
      attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'accountType', 'isActive']
    });

    const fs = require('fs');
    let output = `Found ${users.length} active users:\n`;
    output += '--------------------------------------------------\n';
    users.forEach(u => {
      const roleName = u.Role ? u.Role.name : 'No Role';
      output += `[${u.id}] ${u.firstName} ${u.lastName} (${u.username}) - ${u.email} - Role: ${roleName} - Type: ${u.accountType}\n`;
    });
    output += '--------------------------------------------------\n';
    
    fs.writeFileSync('active_users.txt', output);
    console.log('Active users list written to active_users.txt');
  } catch (err) {
    console.error('Error listing active users:', err);
  } finally {
    process.exit();
  }
}

listActiveUsers();
