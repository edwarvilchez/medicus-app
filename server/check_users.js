const { User, Role } = require('./src/models');
require('dotenv').config();
const sequelize = require('./src/config/db.config');

const checkUsers = async () => {
  try {
    await sequelize.authenticate();
    const emails = [
      'enf.rios@medicus.com',
      'recep.vega@medicus.com',
      'staff.mora@medicus.com',
      'pac.torres@email.com',
      'pac.rivas@email.com',
      'beta@medicus.com'
    ];

    const users = await User.findAll({
      where: { email: emails },
      include: [Role]
    });

    console.log('--- USER LIST ---');
    users.forEach(u => {
      console.log(`Email: ${u.email} | Username: ${u.username} | Role: ${u.Role ? u.Role.name : 'N/A'}`);
    });
    
    if (users.length < emails.length) {
      console.log('\nMissing users:');
      const foundEmails = users.map(u => u.email);
      emails.forEach(e => {
        if (!foundEmails.includes(e)) console.log(`- ${e}`);
      });
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkUsers();
