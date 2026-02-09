const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

module.exports = async (req, res, next) => {
  const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'email', 'roleId', 'organizationId', 'accountType'],
      include: [{ model: Role, attributes: ['name'] }]
    });

    if (!user) {
      return res.status(401).json({ message: 'Token is not valid (User not found)' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.Role?.name || decoded.role,
      organizationId: user.organizationId,
      accountType: user.accountType
    };
    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
