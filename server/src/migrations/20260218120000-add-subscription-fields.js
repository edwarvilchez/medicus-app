'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Organizations', 'subscriptionStatus', {
      type: Sequelize.ENUM('TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELLED'),
      defaultValue: 'TRIAL',
      allowNull: false
    });

    await queryInterface.addColumn('Organizations', 'trialEndsAt', {
      type: Sequelize.DATE,
      allowNull: true
    });

    // Update existing organizations to ACTIVE to prevent lockout
    await queryInterface.sequelize.query(`UPDATE "Organizations" SET "subscriptionStatus" = 'ACTIVE'`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Organizations', 'subscriptionStatus');
    // Drop the enum type if needed, but usually just removing the column is enough for basic rollback
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Organizations_subscriptionStatus";');
    await queryInterface.removeColumn('Organizations', 'trialEndsAt');
  }
};
