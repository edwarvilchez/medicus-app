const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { patientIdSchema } = require('../validators/patient.validator');

router.get('/', authMiddleware, patientController.getPatients);
router.get('/user/:userId', authMiddleware, patientController.getPatientByUserId);
router.delete('/:id', authMiddleware, validate(patientIdSchema, 'params'), patientController.deletePatient);

module.exports = router;
