/**
 * Generic Soft Delete Controller
 * Provides soft delete, restore and trash functionality for all models
 */

const { Op } = require('sequelize');
const logger = require('../utils/logger');

/**
 * Soft delete a record
 */
exports.softDelete = (model, resourceName) => {
  return async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const record = await model.findByPk(id);
      
      if (!record) {
        return res.status(404).json({
          success: false,
          message: `${resourceName} no encontrado`
        });
      }

      await record.update({
        deletedAt: new Date(),
        deletedBy: userId
      });

      logger.info({ 
        resource: resourceName, 
        id, 
        deletedBy: userId 
      }, `${resourceName} soft deleted`);

      res.json({
        success: true,
        message: `${resourceName} eliminado exitosamente`,
        id
      });
    } catch (error) {
      logger.error({ error }, `Error soft deleting ${resourceName}`);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el registro',
        error: error.message
      });
    }
  };
};

/**
 * Restore a soft deleted record
 */
exports.restore = (model, resourceName) => {
  return async (req, res) => {
    try {
      const { id } = req.params;

      const record = await model.findByPk(id, { paranoid: false });

      if (!record) {
        return res.status(404).json({
          success: false,
          message: `${resourceName} no encontrado`
        });
      }

      if (!record.deletedAt) {
        return res.status(400).json({
          success: false,
          message: `${resourceName} no está eliminado`
        });
      }

      await record.update({
        deletedAt: null,
        deletedBy: null
      });

      logger.info({ 
        resource: resourceName, 
        id 
      }, `${resourceName} restored`);

      res.json({
        success: true,
        message: `${resourceName} restaurado exitosamente`,
        id
      });
    } catch (error) {
      logger.error({ error }, `Error restoring ${resourceName}`);
      res.status(500).json({
        success: false,
        message: 'Error al restaurar el registro',
        error: error.message
      });
    }
  };
};

/**
 * List deleted records (trash)
 */
exports.listDeleted = (model, resourceName, includeOptions = {}) => {
  return async (req, res) => {
    try {
      const { limit = 50, offset = 0 } = req.query;
      
      const records = await model.findAll({
        where: {
          deletedAt: {
            [Op.ne]: null
          }
        },
        paranoid: false,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['deletedAt', 'DESC']],
        ...includeOptions
      });

      res.json({
        success: true,
        message: 'Registros eliminados',
        count: records.length,
        records
      });
    } catch (error) {
      logger.error({ error }, `Error listing deleted ${resourceName}`);
      res.status(500).json({
        success: false,
        message: 'Error al listar registros eliminados',
        error: error.message
      });
    }
  };
};

/**
 * Permanently delete a record (for admin use only)
 */
exports.permanentDelete = (model, resourceName) => {
  return async (req, res) => {
    try {
      const { id } = req.params;

      const record = await model.findByPk(id, { paranoid: false });

      if (!record) {
        return res.status(404).json({
          success: false,
          message: `${resourceName} no encontrado`
        });
      }

      await record.destroy({ force: true });

      logger.info({ 
        resource: resourceName, 
        id 
      }, `${resourceName} permanently deleted`);

      res.json({
        success: true,
        message: `${resourceName} eliminado permanentemente`,
        id
      });
    } catch (error) {
      logger.error({ error }, `Error permanently deleting ${resourceName}`);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar permanentemente',
        error: error.message
      });
    }
  };
};
