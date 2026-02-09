const express = require('express');
const router = express.Router();
const bulkController = require('../controllers/bulk.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const { createUpload } = require('../middlewares/upload.middleware');

const upload = createUpload({ dest: 'uploads/temp/', maxSize: 10 * 1024 * 1024, allowedTypes: [
	'text/csv',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	'application/vnd.ms-excel'
] });

router.post('/import/:type', authMiddleware, roleMiddleware(['SUPERADMIN']), upload.single('file'), bulkController.importData);

module.exports = router;
