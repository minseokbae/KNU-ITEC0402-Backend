const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const { getProfile } = require('../controllers/profileController');
const router = express.Router();

// 보호된 프로필 라우트
router.get('/profile', authenticateToken, getProfile);

module.exports = router;
