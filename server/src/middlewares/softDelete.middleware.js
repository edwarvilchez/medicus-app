/**
 * Soft Delete Middleware
 * Handles soft deletion of records across all models
 */

const softDelete = (model) => {
  return async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const record = await model.findByPk(id);
      
      if (!record) {
        return res.status(404).json({ 
          message: 'Registro no encontrado' 
        });
      }

      // Soft delete: set deletedAt and deletedBy
      await record.update({
        deletedAt: new Date(),
        deletedBy: userId
      });

      res.json({ 
        message: 'Registro eliminado exitosamente',
        id: id
      });
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Restore soft deleted record
 */
const restore = (model) => {
  return async (req, res, next) => {
    try {
      const { id } = req.params;

      // Find record including deleted ones
      const record = await model.findByPk(id, { 
        paranoid: false 
      });

      if (!record) {
        return res.status(404).json({ 
          message: 'Registro no encontrado' 
        });
      }

      if (!record.deletedAt) {
        return res.status(400).json({ 
          message: 'El registro no está eliminado' 
        });
      }

      // Restore: clear deletedAt and deletedBy
      await record.update({
        deletedAt: null,
        deletedBy: null
      });

      res.json({ 
        message: 'Registro restaurado exitosamente',
        id: id
      });
    } catch (error) {
      next(error);
    }
  };
};

/**
 * List deleted records (for admin/trash view)
 */
const listDeleted = (model, options = {}) => {
  return async (req, res, next) => {
    try {
      const { limit = 50, offset = 0 } = req.query;
      
      const records = await model.findAll({
        where: {
          deletedAt: {
            [require('sequelize').Op.ne]: null
          }
        },
        paranoid: false,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['deletedAt', 'DESC']],
        include: options.include || []
      });

      res.json({
        message: 'Registros eliminados',
        count: records.length,
        records: records
      });
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  softDelete,
  restore,
  listDeleted
};
