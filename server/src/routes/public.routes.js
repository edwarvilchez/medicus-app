const express = require('express');
const router = express.Router();
const publicController = require('../controllers/public.controller');

// Public routes - no authentication required
router.post('/appointments', publicController.createPublicAppointment);
router.get('/doctors', publicController.getPublicDoctors);

module.exports = router;
