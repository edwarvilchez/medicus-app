const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Nurse = sequelize.define('Nurse', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  licenseNumber: {
    type: DataTypes.STRING,
    unique: true
  },
  specialization: {
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.STRING
  },
  shift: {
    type: DataTypes.ENUM('Morning', 'Afternoon', 'Night', 'Rotating'),
    defaultValue: 'Morning'
  }
});

module.exports = Nurse;
