const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const roleMiddleware = require('../middlewares/role.middleware');

// El controlador manejará qué datos mostrar según el rol
router.get('/', authMiddleware, statsController.getStats);

module.exports = router;
