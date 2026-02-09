const { Payment, Patient, User, Appointment, Doctor } = require('../models');

exports.createPayment = async (req, res) => {
  try {
    const userRole = req.user.role ? req.user.role.toUpperCase() : '';
    const userId = req.user.id;

    if (userRole === 'PATIENT') {
        const patient = await Patient.findOne({ where: { userId } });
        if (!patient) return res.status(400).json({ error: 'Patient profile not found' });
        req.body.patientId = patient.id;
        req.body.status = 'Pending';
    }

    if (req.file) {
        req.body.receiptUrl = `/uploads/${req.file.filename}`;
    }

    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const userRole = req.user.role ? req.user.role.toUpperCase() : '';
    const userId = req.user.id;
    
    console.log(`[DEBUG] getPayments - Role: ${userRole}, UserID: ${userId}`);

    let whereClause = {};

    if (userRole === 'PATIENT') {
       const patient = await Patient.findOne({ where: { userId } });
       
       console.log(`[DEBUG] Found patient for user ${userId}:`, patient ? patient.id : 'NONE');

       if (!patient) {
         return res.json([]);
       }
       whereClause = { patientId: patient.id };
    }

    const payments = await Payment.findAll({ 
      where: whereClause,
      include: [
        { model: Patient, include: [User] },
        { 
          model: Appointment,
          include: [{ model: Doctor, include: [User] }]
        }
      ], 
      order: [['createdAt', 'DESC']] 
    });
    res.json(payments);
  } catch (error) {
    console.error('Error getting payments:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.collectPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id);
    
    if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
    }

    payment.status = 'Paid';
    await payment.save();

    // Confirm appointment automatically if linked
    if (payment.appointmentId) {
        await Appointment.update({ status: 'Confirmed' }, { where: { id: payment.appointmentId } });
    }

    res.json({ message: 'Payment marked as Paid and Appointment Confirmed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role ? req.user.role.toUpperCase() : '';
    const userId = req.user.id;

    const payment = await Payment.findByPk(id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    if (userRole === 'PATIENT') {
        const patient = await Patient.findOne({ where: { userId } });
        if (!patient || payment.patientId !== patient.id) {
            return res.status(403).json({ error: 'You can only delete your own payments' });
        }
        if (payment.status !== 'Pending') {
            return res.status(400).json({ error: 'Only pending payments can be deleted' });
        }
    }

    await payment.destroy();
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role ? req.user.role.toUpperCase() : '';
    const userId = req.user.id;

    const payment = await Payment.findByPk(id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    if (userRole === 'PATIENT') {
        const patient = await Patient.findOne({ where: { userId } });
        if (!patient || payment.patientId !== patient.id) {
            return res.status(403).json({ error: 'You can only update your own payments' });
        }
        if (payment.status !== 'Pending') {
            return res.status(400).json({ error: 'Only pending payments can be updated' });
        }
    }

    if (req.file) {
        req.body.receiptUrl = `/uploads/${req.file.filename}`;
    }

    await payment.update(req.body);
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
