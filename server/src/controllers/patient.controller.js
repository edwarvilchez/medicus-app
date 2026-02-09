const { Patient, User } = require('../models');

exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll({ include: [User] });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPatientByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const patient = await Patient.findOne({ where: { userId }, include: [User] });
    if (!patient) return res.status(404).json({ message: 'Patient profile not found' });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByPk(id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    
    // The User will be deleted due to CASCADE
    await User.destroy({ where: { id: patient.userId } });
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
