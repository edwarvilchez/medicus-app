const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/add', authMiddleware, teamController.addMember);
router.get('/', authMiddleware, teamController.getTeam);
router.delete('/:id', authMiddleware, teamController.removeMember);

module.exports = router;
