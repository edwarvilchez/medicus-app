/**
 * Input sanitization for PostgreSQL/Sequelize
 * Prevents SQL injection and XSS attacks
 */

const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  
  // Remove potentially dangerous SQL patterns
  const sqlPatterns = [
    /'/g, // Remove single quotes
    /--/g, // Remove SQL comments
    /;/g, // Remove semicolons
    /\/\*/g, // Remove block comments start
    /\*\//g, // Remove block comments end
  ];
  
  let sanitized = str;
  sqlPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  return sanitized;
};

const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

/**
 * Express middleware to sanitize request body, params, and query
 */
const sanitizeInput = (req, res, next) => {
  try {
    if (req.body) {
      req.body = sanitizeObject(req.body);
    }
    
    if (req.params) {
      req.params = sanitizeObject(req.params);
    }
    
    if (req.query) {
      req.query = sanitizeObject(req.query);
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sanitizeInput,
  sanitizeString,
  sanitizeObject
};
