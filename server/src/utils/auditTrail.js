const logger = require('./logger');

/**
 * Audit Trail Middleware
 * Logs all changes to entities for compliance and tracking
 */
class AuditTrail {
  constructor() {
    this.ignoredFields = ['createdAt', 'updatedAt', 'password'];
  }

  /**
   * Track changes to an entity
   * @param {string} entity - Entity name (e.g., 'Patient', 'Appointment')
   * @param {string} action - Action type (CREATE, UPDATE, DELETE)
   * @param {Object} data - Change data
   */
  async log(entity, action, data) {
    try {
      const { AuditLog } = require('../models');
      
      await AuditLog.create({
        entity,
        action,
        entityId: data.entityId,
        userId: data.userId,
        oldValues: data.oldValues || null,
        newValues: data.newValues || null,
        ip: data.ip,
        userAgent: data.userAgent,
        timestamp: new Date()
      });

      logger.debug({ entity, action, entityId: data.entityId }, 'Audit trail logged');
    } catch (error) {
      logger.error({ error, entity, action }, 'Failed to log audit trail');
    }
  }

  /**
   * Express middleware to track request context
   */
  middleware() {
    return (req, res, next) => {
      req.audit = {
        userId: req.user?.id,
        ip: req.ip,
        userAgent: req.get('user-agent')
      };
      next();
    };
  }

  /**
   * Compare old and new values to find changes
   * @param {Object} oldValues - Previous values
   * @param {Object} newValues - New values
   * @returns {Object} - Changed fields only
   */
  getChanges(oldValues, newValues) {
    const changes = {};
    
    for (const key of Object.keys(newValues)) {
      if (this.ignoredFields.includes(key)) continue;
      
      if (JSON.stringify(oldValues[key]) !== JSON.stringify(newValues[key])) {
        changes[key] = {
          from: oldValues[key],
          to: newValues[key]
        };
      }
    }
    
    return changes;
  }
}

module.exports = new AuditTrail();
