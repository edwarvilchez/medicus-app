const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, paymentController.createPayment);
router.get('/', authMiddleware, paymentController.getPayments);
router.post('/collect/:id', authMiddleware, paymentController.collectPayment);

module.exports = router;
