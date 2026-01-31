const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  reason: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed'),
    defaultValue: 'Pending'
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = Appointment;
