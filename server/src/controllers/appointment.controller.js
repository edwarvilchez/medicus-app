const { Appointment, Patient, Doctor, User } = require('../models');
const whatsapp = require('../utils/whatsapp.service');

exports.createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, reason, notes } = req.body;
    
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date,
      reason,
      notes,
      status: 'Confirmed'
    });

    // Fetch details for WhatsApp
    const appointmentDetails = await Appointment.findByPk(appointment.id, {
      include: [
        { model: Patient, include: [User] },
        { model: Doctor, include: [User] }
      ]
    });

    const patientPhone = appointmentDetails.Patient.phone;
    const patientName = `${appointmentDetails.Patient.User.firstName} ${appointmentDetails.Patient.User.lastName}`;
    const doctorName = `${appointmentDetails.Doctor.User.firstName} ${appointmentDetails.Doctor.User.lastName}`;
    const appointmentDate = new Date(date);
    
    // Send WhatsApp (async, don't block response)
    whatsapp.sendAppointmentReminder(patientPhone, {
      patientName,
      doctorName,
      date: appointmentDate.toLocaleDateString(),
      time: appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }).catch(err => console.error('WhatsApp Error:', err));

    res.status(201).json(appointmentDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        { model: Patient, include: [User] },
        { model: Doctor, include: [User] }
      ],
      order: [['date', 'ASC']]
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await Appointment.update({ status }, { where: { id } });
    res.json({ message: 'Status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
