const express = require('express');
const router = express.Router();
const labResultController = require('../controllers/labResult.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, labResultController.createLabResult);
router.get('/patient/:patientId', authMiddleware, labResultController.getPatientLabs);

module.exports = router;
