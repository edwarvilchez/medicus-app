const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Staff = sequelize.define('Staff', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  employeeId: {
    type: DataTypes.STRING,
    unique: true
  },
  position: {
    type: DataTypes.STRING
  },
  departmentName: {
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.STRING
  }
});

module.exports = Staff;
