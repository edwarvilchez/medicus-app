const { Payment, Patient, User, Appointment } = require('../models');

exports.createPayment = async (req, res) => {
  try {
    const userRole = req.user.role ? req.user.role.toUpperCase() : '';
    const userId = req.user.id;

    if (userRole === 'PATIENT') {
        const patient = await Patient.findOne({ where: { userId } });
        if (!patient) return res.status(400).json({ error: 'Patient profile not found' });
        req.body.patientId = patient.id;
        req.body.status = 'Pending'; // Patients always create pending payments
    }

    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
      include: [{ model: Patient, include: [User] }], 
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
