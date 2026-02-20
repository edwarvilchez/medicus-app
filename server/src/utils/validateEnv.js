/**
 * Environment Variables Validator
 * Ensures the server doesn't start without critical configuration.
 */
const logger = require('./logger');

const requiredVars = [
  'JWT_SECRET',
  'DB_HOST',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'CLIENT_URL',
  'SMTP_HOST',
  'SMTP_EMAIL',
  'SMTP_PASSWORD'
];

const validateEnv = () => {
  const missing = requiredVars.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    logger.error({ missing }, '❌ CRITICAL: Missing Environment Variables');
    
    // In production, we exit to prevent inconsistent state
    if (process.env.NODE_ENV === 'production') {
      console.error('\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      console.error('!!  SHUTTING DOWN: Missing required variables   !!');
      console.error(`!!  ${missing.join(', ')}`);
      console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n');
      process.exit(1);
    } else {
      logger.warn('⚠️ Server starting with missing vars (Development mode)');
    }
  } else {
    logger.info('✅ Environment variables validated');
  }
};

module.exports = validateEnv;
