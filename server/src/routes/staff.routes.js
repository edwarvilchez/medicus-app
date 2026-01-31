const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staff.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, staffController.getStaff);
router.delete('/:id', authMiddleware, staffController.deleteStaff);

module.exports = router;
