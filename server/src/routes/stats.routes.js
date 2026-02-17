const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { cacheMiddleware } = require('../utils/cache');

const roleMiddleware = require('../middlewares/role.middleware');

// Cache stats for 5 minutes (stats change frequently but not instantly)
router.get('/', authMiddleware, cacheMiddleware(300, 'stats'), statsController.getStats);

module.exports = router;
