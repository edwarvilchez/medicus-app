const { LabResult } = require('../models');

exports.createLabResult = async (req, res) => {
  try {
    const result = await LabResult.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPatientLabs = async (req, res) => {
  try {
    const { patientId } = req.params;
    const labs = await LabResult.findAll({ where: { patientId }, order: [['createdAt', 'DESC']] });
    res.json(labs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
