const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Doctor = sequelize.define('Doctor', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  licenseNumber: {
    type: DataTypes.STRING,
    unique: true
  },
  phone: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.TEXT
  },
  specialtyId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Specialties', 
      key: 'id'
    }
  }
});

module.exports = Doctor;
