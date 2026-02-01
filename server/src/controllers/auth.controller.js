const { User, Role, Patient } = require('../models');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, roleName, patientData } = req.body;
    
    let role = await Role.findOne({ where: { name: roleName || 'PATIENT' } });
    
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      roleId: role.id
    });

    // If registering as a patient, create patient record
    if (role.name === 'PATIENT' && patientData) {
      await Patient.create({
        userId: user.id,
        documentId: patientData.documentId,
        phone: patientData.phone,
        birthDate: patientData.birthDate,
        gender: patientData.gender,
        address: patientData.address,
        bloodType: patientData.bloodType,
        allergies: patientData.allergies
      });
    }

    const token = jwt.sign({ id: user.id, role: role.name }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.status(201).json({ token, user: { id: user.id, username, email, firstName, lastName, role: role.name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email }, include: [Role] });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.Role.name }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, username: user.username, email, firstName: user.firstName, lastName: user.lastName, role: user.Role.name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { include: [Role], attributes: { exclude: ['password'] } });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'No existe un usuario con ese email' });
    }

    // Generate random token
    const crypto = require('crypto');
    const token = crypto.randomBytes(20).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await user.update({
      resetToken: token,
      resetExpires: expires
    });

    // Create reset URL
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:4200';
    const resetUrl = `${clientUrl}/reset-password/${token}`;

    const message = `Hola ${user.firstName},\n\nHas solicitado restablecer tu contraseña en Clínica Medicus. Por favor, utiliza el siguiente enlace para crear una nueva clave:\n\n${resetUrl}\n\nEste enlace expirará en 1 hora por tu seguridad.\n\nSi no solicitaste este cambio, simplemente ignora este correo.\n\nSaludos,\nEquipo de Clínica Medicus.`;

    const sendEmail = require('../utils/sendEmail');

    try {
      await sendEmail({
        email: user.email,
        subject: 'Recuperación de Contraseña - Clínica Medicus',
        message: message
      });

      res.status(200).json({ 
        success: true, 
        message: 'Correo de recuperación enviado',
        debugToken: process.env.NODE_ENV !== 'production' ? token : undefined 
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);
      
      if (process.env.NODE_ENV !== 'production') {
        return res.status(200).json({ 
          success: true, 
          message: 'Error al enviar email (modo desarrollo), pero el token fue generado.',
          debugToken: token 
        });
      }

      // If email fails in production, clear the token fields
      await user.update({
        resetToken: null,
        resetExpires: null
      });
      return res.status(500).json({ error: 'Hubo un error enviando el correo. Intenta de nuevo más tarde.' });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const { Op } = require('sequelize');
    
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetExpires: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    await user.update({
      password: password,
      resetToken: null,
      resetExpires: null
    });

    // Send confirmation email
    const sendEmail = require('../utils/sendEmail');
    try {
      await sendEmail({
        email: user.email,
        subject: 'Tu contraseña de Clínica Medicus ha sido actualizada',
        message: `Hola ${user.firstName},\n\nTe informamos que la contraseña de tu cuenta en Clínica Medicus ha sido cambiada exitosamente.\n\nSi no realizaste este cambio, por favor contacta a soporte de inmediato.\n\nSaludos,\nEquipo de Clínica Medicus.`
      });
    } catch (emailError) {
      console.error('Confirmation email failed:', emailError.message);
      // We don't block the response if confirmation email fails
    }

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
