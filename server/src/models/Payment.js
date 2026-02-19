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
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD'
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
  },
  receiptUrl: {
    type: DataTypes.STRING
  },
  paymentType: {
    type: DataTypes.STRING,
    defaultValue: 'APPOINTMENT' // 'APPOINTMENT', 'SUBSCRIPTION'
  },
  billingCycle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  planType: {
    type: DataTypes.STRING, // 'PROFESSIONAL', 'CLINIC', 'HOSPITAL'
    allowNull: true
  },
  organizationId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Organizations',
      key: 'id'
    }
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deletedBy: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  paranoid: true
});

module.exports = Payment;
