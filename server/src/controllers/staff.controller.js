const { Staff, User } = require('../models');

exports.getStaff = async (req, res) => {
  try {
    const staff = await Staff.findAll({ include: [User] });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Staff.findByPk(id);
    if (!item) return res.status(404).json({ message: 'Staff member not found' });
    
    await User.destroy({ where: { id: item.userId } });
    res.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
