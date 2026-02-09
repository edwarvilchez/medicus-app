const express = require('express');
const router = express.Router();
const bulkController = require('../controllers/bulk.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const multer = require('multer');

const upload = multer({ dest: 'uploads/temp/' });

router.post('/import/:type', authMiddleware, roleMiddleware(['SUPERADMIN']), upload.single('file'), bulkController.importData);

module.exports = router;
