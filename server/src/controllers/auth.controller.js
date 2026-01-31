const { User, Role } = require('../models');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, roleName } = req.body;
    
    let role = await Role.findOne({ where: { name: roleName || 'PATIENT' } });
    
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      roleId: role.id
    });

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
