const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const MedicalRecord = sequelize.define('MedicalRecord', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  diagnosis: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  treatment: {
    type: DataTypes.TEXT
  },
  indications: {
    type: DataTypes.TEXT
  },
  physicalExam: {
    type: DataTypes.TEXT
  }
});

module.exports = MedicalRecord;
