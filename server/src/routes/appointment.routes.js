const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');

router.post('/', appointmentController.createAppointment);
router.get('/', appointmentController.getAppointments);
router.patch('/:id/status', appointmentController.updateStatus);
router.post('/:id/cancel', appointmentController.cancelAppointment);
router.post('/:id/reschedule', appointmentController.rescheduleAppointment);

module.exports = router;
