const { Payment } = require('../models');

exports.createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const { Patient, User } = require('../models');
    const payments = await Payment.findAll({ 
      include: [{ model: Patient, include: [User] }], 
      order: [['createdAt', 'DESC']] 
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.collectPayment = async (req, res) => {
  try {
    const { id } = req.params;
    await Payment.update({ status: 'Paid' }, { where: { id } });
    res.json({ message: 'Payment marked as Paid' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
