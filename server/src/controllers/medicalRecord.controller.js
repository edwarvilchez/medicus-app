const { MedicalRecord, Patient, Doctor, User } = require('../models');

exports.createRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.create(req.body);
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPatientHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    const records = await MedicalRecord.findAll({
      where: { patientId },
      include: [{ model: Doctor, include: [User] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
