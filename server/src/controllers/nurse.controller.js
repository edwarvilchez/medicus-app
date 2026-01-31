const { Nurse, User } = require('../models');

exports.getNurses = async (req, res) => {
  try {
    const nurses = await Nurse.findAll({ include: [User] });
    res.json(nurses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteNurse = async (req, res) => {
  try {
    const { id } = req.params;
    const nurse = await Nurse.findByPk(id);
    if (!nurse) return res.status(404).json({ message: 'Nurse not found' });
    
    await User.destroy({ where: { id: nurse.userId } });
    res.json({ message: 'Nurse deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
