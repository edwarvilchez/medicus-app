const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecord.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, medicalRecordController.createRecord);
router.get('/patient/:patientId', authMiddleware, medicalRecordController.getPatientHistory);

module.exports = router;
