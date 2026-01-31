const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const LabResult = sequelize.define('LabResult', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  testName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  resultValue: {
    type: DataTypes.TEXT
  },
  referenceRange: {
    type: DataTypes.STRING
  },
  fileUrl: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Completed'),
    defaultValue: 'Completed'
  }
});

module.exports = LabResult;
