'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('Organizations');

    if (!tableInfo.subscriptionStatus) {
      await queryInterface.addColumn('Organizations', 'subscriptionStatus', {
        type: Sequelize.ENUM('TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELLED'),
        defaultValue: 'TRIAL'
      });
    }

    if (!tableInfo.trialEndsAt) {
      await queryInterface.addColumn('Organizations', 'trialEndsAt', {
        type: Sequelize.DATE,
        allowNull: true
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('Organizations');
    
    if (tableInfo.subscriptionStatus) {
        await queryInterface.removeColumn('Organizations', 'subscriptionStatus');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Organizations_subscriptionStatus";');
    }

    if (tableInfo.trialEndsAt) {
        await queryInterface.removeColumn('Organizations', 'trialEndsAt');
    }
  }
};
