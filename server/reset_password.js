const { User } = require('./src/models');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.log('Usage: node reset_password.js <email> <new_password>');
  process.exit(1);
}

async function resetPassword() {
  try {
    console.log(`Searching for user with email: ${email}`);
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log('❌ User not found!');
      process.exit(1);
    }

    console.log(`User found: ${user.username} (${user.id})`);
    
    // Hash password manually just to be sure, or let the hook handle it?
    // User model has beforeUpdate hook that hashes if password changed.
    // So we just update the password field.
    
    // However, if we want to be 100% sure, we can rely on the hook.
    // Let's verify the hook exists in User.js.
    // Yes: beforeUpdate: async (user) => { if (user.changed('password')) ... }
    
    user.password = newPassword;
    await user.save();
    
    console.log('✅ Password updated successfully!');
    
  } catch (error) {
    console.error('❌ Error updating password:', error);
  } finally {
    process.exit();
  }
}

resetPassword();
