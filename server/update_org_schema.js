const { Organization } = require('./src/models');
const sequelize = require('./src/config/db.config');

async function updateSchema() {
  try {
    console.log('🔄 Syncing Organization model...');
    await Organization.sync({ alter: true });
    
    console.log('🔄 Adding organizationId to Users...');
    await sequelize.query('ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "organizationId" UUIDReferences "Organizations"("id") ON DELETE SET NULL;');

    console.log('✅ Schema updated successfully');
  } catch (error) {
    console.error('❌ Schema update failed:', error);
  } finally {
    process.exit();
  }
}

updateSchema();
