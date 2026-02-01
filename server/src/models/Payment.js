const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  method: {
    type: DataTypes.STRING,
    defaultValue: 'Cash'
  },
  status: {
    type: DataTypes.ENUM('Paid', 'Pending', 'Cancelled'),
    defaultValue: 'Pending'
  },
  reference: {
    type: DataTypes.STRING
  },
  concept: {
    type: DataTypes.STRING
  },
  bank: {
    type: DataTypes.STRING
  },
  instrument: {
    type: DataTypes.STRING
  }
});

module.exports = Payment;
