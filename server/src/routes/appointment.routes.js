const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, appointmentController.createAppointment);
router.get('/', authMiddleware, appointmentController.getAppointments);
router.patch('/:id/status', authMiddleware, appointmentController.updateStatus);
router.post('/:id/cancel', authMiddleware, appointmentController.cancelAppointment);
router.post('/:id/reschedule', authMiddleware, appointmentController.rescheduleAppointment);

module.exports = router;
