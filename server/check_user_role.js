const { User, Role } = require('./src/models');
const sequelize = require('./src/config/db.config');

async function check() {
  try {
    const user = await User.findOne({ 
      where: { firstName: 'Juan' }, 
      include: [Role] 
    });
    
    if (user) {
      console.log(`CHECK_USER_ROLE: User Juan found. ID=${user.id}, Role=${user.Role ? user.Role.name : 'No Role'}`);
    } else {
      console.log('CHECK_USER_ROLE: User Juan not found');
      // List all users to see who exists
      const users = await User.findAll({ limit: 5, include: [Role] });
      users.forEach(u => console.log(`User: ${u.firstName} ${u.lastName} (${u.Role?.name})`));
    }
  } catch (err) {
    console.error('Error checking user:', err);
  } finally {
    process.exit(); // No necesitamos cerrar sequelize explícitamente si salimos del proceso
  }
}

check();
