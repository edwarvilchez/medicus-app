const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Organization = sequelize.define('Organization', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('PROFESSIONAL', 'CLINIC', 'HOSPITAL'),
    allowNull: false
  },
  subscriptionStatus: {
    type: DataTypes.ENUM('TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELLED'),
    defaultValue: 'TRIAL'
  },
  trialEndsAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  settings: {
    type: DataTypes.JSONB, // For future settings like logo, theme, etc.
    defaultValue: {}
  }
});

module.exports = Organization;
