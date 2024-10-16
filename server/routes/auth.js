const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();

// 회원가입 라우트
router.post('/register', registerUser);

// 로그인 라우트
router.post('/login', loginUser);

module.exports = router;
