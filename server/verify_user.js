const { User, Role } = require('./src/models');
const bcrypt = require('bcryptjs');

async function verify() {
  try {
    const email = process.env.TEST_USER_EMAIL || 'admin@hgc.com';
    const password = process.env.TEST_USER_PASSWORD || 'medicus123';

    console.log(`🔍 Checking user: ${email}`);
    const user = await User.findOne({ where: { email }, include: [Role] });

    if (!user) {
      console.log('❌ User not found in database.');
      return;
    }

    console.log(`✅ User found: ID=${user.id}, Role=${user.Role ? user.Role.name : 'NULL'}`);
    console.log(`🏢 Organization ID: ${user.organizationId}`);
    console.log(`🔑 Stored Hash: ${user.password}`);

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (isMatch) {
      console.log('✅ Password Match: SUCCESS');
    } else {
      console.log('❌ Password Match: FAILED');
      
      // Debug: Hash the password manually to see what it should look like
      const testHash = await bcrypt.hash(password, 10);
      console.log(`ℹ️  New Hash for comparison: ${testHash}`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

verify();
