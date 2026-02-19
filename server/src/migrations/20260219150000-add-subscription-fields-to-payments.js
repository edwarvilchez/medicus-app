'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if columns exist to prevent errors on re-run
    const tableInfo = await queryInterface.describeTable('Payments');

    if (!tableInfo.paymentType) {
      await queryInterface.addColumn('Payments', 'paymentType', {
        type: Sequelize.STRING,
        defaultValue: 'APPOINTMENT'
      });
    }

    if (!tableInfo.billingCycle) {
      await queryInterface.addColumn('Payments', 'billingCycle', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    if (!tableInfo.planType) {
      await queryInterface.addColumn('Payments', 'planType', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    if (!tableInfo.organizationId) {
      await queryInterface.addColumn('Payments', 'organizationId', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Organizations',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('Payments');
    
    if (tableInfo.organizationId) await queryInterface.removeColumn('Payments', 'organizationId');
    if (tableInfo.planType) await queryInterface.removeColumn('Payments', 'planType');
    if (tableInfo.billingCycle) await queryInterface.removeColumn('Payments', 'billingCycle');
    if (tableInfo.paymentType) await queryInterface.removeColumn('Payments', 'paymentType');
  }
};
