const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const roleMiddleware = require('../middlewares/role.middleware');

router.get('/', authMiddleware, doctorController.getDoctors);
router.delete('/:id', authMiddleware, roleMiddleware(['SUPERADMIN']), doctorController.deleteDoctor);

module.exports = router;
