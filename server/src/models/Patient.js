const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  documentId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  birthDate: {
    type: DataTypes.DATEONLY
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other')
  },
  phone: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.TEXT
  },
  bloodType: {
    type: DataTypes.STRING
  },
  allergies: {
    type: DataTypes.TEXT
  }
});

module.exports = Patient;
