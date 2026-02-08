const express = require('express');
const router = express.Router();
const videoConsultationController = require('../controllers/videoConsultation.controller');
const authMiddleware = require('../middlewares/auth.middleware');

console.log('📦 Loading VideoConsultation Controller...');
console.log('📦 Controller Create Function:', videoConsultationController.createVideoConsultation ? 'Found' : 'MISSING');

if (!videoConsultationController.createVideoConsultation) {
  console.error('❌ FATAL: createVideoConsultation is not exported from the controller!');
}

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Crear videoconsulta
router.post('/', videoConsultationController.createVideoConsultation);

// Obtener videoconsultas del usuario actual
router.get('/my-consultations', videoConsultationController.getDoctorVideoConsultations);
router.get('/my-patient-consultations', videoConsultationController.getPatientVideoConsultations);

// Obtener videoconsulta por ID
router.get('/:id', videoConsultationController.getVideoConsultation);

// Obtener videoconsulta por roomId
router.get('/room/:roomId', videoConsultationController.getVideoConsultationByRoom);

// Iniciar videoconsulta
router.put('/:id/start', videoConsultationController.startVideoConsultation);

// Finalizar videoconsulta
router.put('/:id/end', videoConsultationController.endVideoConsultation);

// Cancelar videoconsulta
router.put('/:id/cancel', videoConsultationController.cancelVideoConsultation);

module.exports = router;
