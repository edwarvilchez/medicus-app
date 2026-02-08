const { VideoConsultation, User, Appointment, Doctor, Patient } = require('../models');
const { v4: uuidv4 } = require('uuid');

// Crear sala de videoconsulta
exports.createVideoConsultation = async (req, res) => {
  try {
    console.log('📥 Request body:', req.body);
    console.log('👤 User from token:', req.user);
    
    const { appointmentId } = req.body;
    const doctorId = req.user.id; // Del middleware de autenticación

    // Verificar que la cita existe
    const appointment = await Appointment.findByPk(appointmentId, {
      include: [
        { 
          model: Patient, 
          include: [{ model: User }]
        },
        {
          model: Doctor,
          include: [{ model: User }]
        }
      ]
    });

    console.log('📋 Appointment found:', appointment ? 'Yes' : 'No');
    if (appointment) {
      console.log('👥 Patient User ID:', appointment.Patient?.User?.id);
      console.log('👨‍⚕️ Doctor User ID:', appointment.Doctor?.User?.id);
    }

    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    // Obtener el userId del paciente desde la cita
    const patientUserId = appointment.Patient?.User?.id;
    const doctorUserId = appointment.Doctor?.User?.id;

    if (!patientUserId || !doctorUserId) {
      return res.status(400).json({ message: 'Datos de la cita incompletos' });
    }

    // Verificar que no exista ya una videoconsulta para esta cita
    const existing = await VideoConsultation.findOne({ where: { appointmentId } });
    if (existing) {
      return res.status(200).json({
        message: 'Videoconsulta ya existe',
        videoConsultation: existing
      });
    }

    // Generar ID único para la sala
    const roomId = uuidv4();

    const videoConsultation = await VideoConsultation.create({
      appointmentId,
      doctorId: doctorUserId,
      patientId: patientUserId,
      roomId,
      status: 'scheduled'
    });

    console.log(`✅ Videoconsulta creada: ${roomId}`);

    res.status(201).json({
      message: 'Videoconsulta creada exitosamente',
      videoConsultation
    });
  } catch (error) {
    const fs = require('fs');
    const path = require('path');
    const logPath = path.join(__dirname, '../../server_error.log');
    const errorMessage = `[${new Date().toISOString()}] ERROR: ${error.message}\nSTACK: ${error.stack}\n\n`;
    
    try {
      fs.appendFileSync(logPath, errorMessage);
    } catch (e) {
      console.error('Error writing to log file', e);
    }

    console.error('❌ Error creando videoconsulta:', error);
    res.status(500).json({ 
      message: 'Error del servidor', 
      error: error.message,
      stack: error.stack
    });
  }
};

// Obtener videoconsulta por ID
exports.getVideoConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📥 GET VideoConsultation ID: ${id}`);
    
    // Primero verificar si existe sin relaciones complejas
    const simpleCheck = await VideoConsultation.findByPk(id);
    if (!simpleCheck) {
      console.log('❌ No encontrada en chequeo simple');
      return res.status(404).json({ message: 'Videoconsulta no encontrada' });
    }
    console.log('✅ Chequeo simple OK. Cargando relaciones...');

    const videoConsultation = await VideoConsultation.findByPk(id, {
      include: [
        { 
          model: User, 
          as: 'doctor', 
          attributes: ['id', 'firstName', 'lastName', 'email'],
          include: [{ model: Doctor, attributes: ['licenseNumber'] }]
        },
        { 
          model: User, 
          as: 'patient', 
          attributes: ['id', 'firstName', 'lastName', 'email'],
          include: [{ model: Patient, attributes: ['birthDate', 'bloodType'] }]
        },
        { model: Appointment }
      ]
    });

    console.log('✅ Relaciones cargadas correctamente');

    if (!videoConsultation) {
      return res.status(404).json({ message: 'Videoconsulta no encontrada' });
    }

    res.json(videoConsultation);
  } catch (error) {
    const fs = require('fs');
    const path = require('path');
    const logPath = path.join(__dirname, '../../server_error.log');
    const errorMessage = `[${new Date().toISOString()}] ERROR GET /${req.params.id}: ${error.message}\nSTACK: ${error.stack}\n\n`;
    
    try {
      fs.appendFileSync(logPath, errorMessage);
    } catch (e) {
      console.error('Error writing to log file', e);
    }

    console.error('❌ Error obteniendo videoconsulta:', error);
    res.status(500).json({ message: 'Error del servidor', error: error.message, stack: error.stack });
  }
};

// Obtener videoconsulta por roomId
exports.getVideoConsultationByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const videoConsultation = await VideoConsultation.findOne({
      where: { roomId },
      include: [
        { model: User, as: 'doctor', attributes: ['id', 'firstName', 'lastName'] },
        { model: User, as: 'patient', attributes: ['id', 'firstName', 'lastName'] },
        { model: Appointment }
      ]
    });

    if (!videoConsultation) {
      return res.status(404).json({ message: 'Sala no encontrada' });
    }

    res.json(videoConsultation);
  } catch (error) {
    console.error('❌ Error obteniendo videoconsulta por sala:', error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// Iniciar videoconsulta
exports.startVideoConsultation = async (req, res) => {
  try {
    const { id } = req.params;

    const videoConsultation = await VideoConsultation.findByPk(id);
    if (!videoConsultation) {
      return res.status(404).json({ message: 'Videoconsulta no encontrada' });
    }

    if (videoConsultation.status === 'active') {
      return res.json({
        message: 'Videoconsulta ya está activa',
        videoConsultation
      });
    }

    videoConsultation.status = 'active';
    videoConsultation.startTime = new Date();
    await videoConsultation.save();

    console.log(`▶️ Videoconsulta iniciada: ${videoConsultation.roomId}`);

    res.json({
      message: 'Videoconsulta iniciada',
      videoConsultation
    });
  } catch (error) {
    console.error('❌ Error iniciando videoconsulta:', error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// Finalizar videoconsulta
exports.endVideoConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const videoConsultation = await VideoConsultation.findByPk(id);
    if (!videoConsultation) {
      return res.status(404).json({ message: 'Videoconsulta no encontrada' });
    }

    if (videoConsultation.status === 'completed') {
      return res.json({
        message: 'Videoconsulta ya fue finalizada',
        videoConsultation
      });
    }

    const endTime = new Date();
    const startTime = new Date(videoConsultation.startTime);
    const duration = videoConsultation.startTime 
      ? Math.round((endTime - startTime) / 60000) // minutos
      : 0;

    videoConsultation.status = 'completed';
    videoConsultation.endTime = endTime;
    videoConsultation.duration = duration;
    videoConsultation.notes = notes || null;
    await videoConsultation.save();

    console.log(`⏹️ Videoconsulta finalizada: ${videoConsultation.roomId} (${duration} min)`);

    res.json({
      message: 'Videoconsulta finalizada',
      videoConsultation
    });
  } catch (error) {
    console.error('❌ Error finalizando videoconsulta:', error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// Listar videoconsultas del doctor
exports.getDoctorVideoConsultations = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const consultations = await VideoConsultation.findAll({
      where: { doctorId },
      include: [
        { model: User, as: 'patient', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Appointment, attributes: ['id', 'date', 'time', 'status'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(consultations);
  } catch (error) {
    console.error('❌ Error obteniendo videoconsultas del doctor:', error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// Listar videoconsultas del paciente
exports.getPatientVideoConsultations = async (req, res) => {
  try {
    const patientId = req.user.id;

    const consultations = await VideoConsultation.findAll({
      where: { patientId },
      include: [
        { 
          model: User, 
          as: 'doctor', 
          attributes: ['id', 'firstName', 'lastName', 'email'],
          include: [{ model: Doctor, attributes: ['licenseNumber'] }]
        },
        { model: Appointment, attributes: ['id', 'date', 'time', 'status'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(consultations);
  } catch (error) {
    console.error('❌ Error obteniendo videoconsultas del paciente:', error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// Cancelar videoconsulta
exports.cancelVideoConsultation = async (req, res) => {
  try {
    const { id } = req.params;

    const videoConsultation = await VideoConsultation.findByPk(id);
    if (!videoConsultation) {
      return res.status(404).json({ message: 'Videoconsulta no encontrada' });
    }

    if (videoConsultation.status === 'completed') {
      return res.status(400).json({ message: 'No se puede cancelar una videoconsulta completada' });
    }

    videoConsultation.status = 'cancelled';
    await videoConsultation.save();

    console.log(`🚫 Videoconsulta cancelada: ${videoConsultation.roomId}`);

    res.json({
      message: 'Videoconsulta cancelada',
      videoConsultation
    });
  } catch (error) {
    console.error('❌ Error cancelando videoconsulta:', error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};
