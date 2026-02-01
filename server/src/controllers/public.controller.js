const { Patient, User, Doctor, Appointment } = require('../models');
const { sendAppointmentConfirmation } = require('../utils/whatsapp.service');

exports.createPublicAppointment = async (req, res) => {
  try {
    const { patientInfo, appointmentInfo } = req.body;
    
    // Check if patient exists by email or documentId
    let user = await User.findOne({ 
      where: { email: patientInfo.email } 
    });
    
    let patient;
    let accountExists = false;

    if (user) {
      // User exists, find their patient record
      patient = await Patient.findOne({ where: { userId: user.id } });
      accountExists = true;
      
      // Update patient info if needed
      if (patient) {
        await patient.update({
          phone: patientInfo.phone,
          documentId: patientInfo.documentId
        });
      }
    } else {
      // Check by documentId
      patient = await Patient.findOne({ 
        where: { documentId: patientInfo.documentId },
        include: [User]
      });
      
      if (patient) {
        // Patient exists, update info
        accountExists = true;
        await patient.update({ phone: patientInfo.phone });
        await patient.User.update({ email: patientInfo.email });
        user = patient.User;
      } else {
        // Create new user and patient (temporary/guest account)
        const username = `patient_${patientInfo.documentId.replace(/[^a-zA-Z0-9]/g, '')}`;
        const tempPassword = Math.random().toString(36).slice(-8);
        
        // Find PATIENT role
        const Role = require('../models').Role;
        const patientRole = await Role.findOne({ where: { name: 'PATIENT' } });
        
        user = await User.create({
          username,
          email: patientInfo.email,
          password: tempPassword,
          firstName: patientInfo.firstName,
          lastName: patientInfo.lastName,
          roleId: patientRole.id
        });

        patient = await Patient.create({
          userId: user.id,
          documentId: patientInfo.documentId,
          phone: patientInfo.phone
        });
      }
    }

    // Create appointment
    const appointment = await Appointment.create({
      patientId: patient.id,
      doctorId: appointmentInfo.doctorId,
      date: appointmentInfo.date,
      reason: appointmentInfo.reason,
      notes: appointmentInfo.notes,
      status: 'Confirmed'
    });

    // Fetch full appointment details for WhatsApp
    const appointmentDetails = await Appointment.findByPk(appointment.id, {
      include: [
        { model: Patient, include: [User] },
        { model: Doctor, include: [User] }
      ]
    });

    // Send WhatsApp confirmation
    try {
      await sendAppointmentConfirmation(
        patient.phone,
        {
          patientName: `${patientInfo.firstName} ${patientInfo.lastName}`,
          date: new Date(appointmentInfo.date).toLocaleDateString('es-ES'),
          time: new Date(appointmentInfo.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          doctorName: appointmentDetails.Doctor.User.firstName + ' ' + appointmentDetails.Doctor.User.lastName,
          appointmentId: appointment.id,
          rawDate: new Date(appointmentInfo.date)
        }
      );
      console.log('✅ WhatsApp notification sent successfully');
    } catch (whatsappError) {
      console.error('❌ WhatsApp notification failed:', whatsappError.message);
      // Don't fail the appointment creation if WhatsApp fails
    }

    // Send Email confirmation
    try {
      const sendEmail = require('../utils/sendEmail');
      const doctorName = `${appointmentDetails.Doctor.User.firstName} ${appointmentDetails.Doctor.User.lastName}`;
      const appointmentDate = new Date(appointmentInfo.date);
      const formattedDate = appointmentDate.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const formattedTime = appointmentDate.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      const emailMessage = `Hola ${patientInfo.firstName},

Tu cita ha sido agendada exitosamente en Clínica Medicus.

📋 DETALLES DE LA CITA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👨‍⚕️ Doctor: Dr. ${doctorName}
📅 Fecha: ${formattedDate}
⏰ Hora: ${formattedTime}
📝 Motivo: ${appointmentInfo.reason}
🏥 Lugar: Clínica Medicus

${appointmentInfo.notes ? `📌 Notas: ${appointmentInfo.notes}\n` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANTE:
• Por favor llega 10 minutos antes de tu cita
• Trae tu documento de identidad
• Si necesitas cancelar o reagendar, contáctanos con al menos 24 horas de anticipación

También hemos enviado la confirmación a tu WhatsApp: ${patient.phone}

Saludos,
Equipo de Clínica Medicus`;

      await sendEmail({
        email: user.email,
        subject: '✅ Confirmación de Cita - Clínica Medicus',
        message: emailMessage
      });
      console.log('✅ Email confirmation sent successfully to:', user.email);
    } catch (emailError) {
      console.error('❌ Email notification failed:', emailError.message);
      // Don't fail the appointment creation if email fails
    }

    res.status(201).json({ 
      message: 'Appointment created successfully',
      appointmentId: appointment.id,
      accountExists
    });
  } catch (error) {
    console.error('Error creating public appointment:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getPublicDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({ 
      include: [
        { 
          model: User,
          attributes: ['firstName', 'lastName', 'email']
        },
        {
          model: require('../models').Specialty,
          attributes: ['name']
        }
      ]
    });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
