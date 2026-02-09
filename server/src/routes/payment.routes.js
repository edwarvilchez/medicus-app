const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/', authMiddleware, upload.single('receipt'), paymentController.createPayment);
router.get('/', authMiddleware, paymentController.getPayments);
router.post('/collect/:id', authMiddleware, paymentController.collectPayment);
router.put('/:id', authMiddleware, upload.single('receipt'), paymentController.updatePayment);
router.delete('/:id', authMiddleware, paymentController.deletePayment);

module.exports = router;
