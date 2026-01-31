const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, patientController.getPatients);
router.delete('/:id', authMiddleware, patientController.deletePatient);

module.exports = router;
