const { Doctor, User, Specialty } = require('../models');

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({ include: [User, Specialty] });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findByPk(id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    
    await User.destroy({ where: { id: doctor.userId } });
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
