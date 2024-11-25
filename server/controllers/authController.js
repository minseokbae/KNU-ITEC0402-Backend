require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const JWT_SECRET = process.env.JWT_SECRET;
const { v4: uuidv4 } = require('uuid');

// 회원가입 로직
const registerUser = async (req, res) => {
  const { id, password, confirmPassword, companyName } = req.body; // companyName 추가
  const userId = uuidv4(); // 고유 사용자 ID 생성

  // 비밀번호 확인
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 데이터베이스에 사용자 정보 저장 (companyName 포함)
    const result = await db.query(
      'INSERT INTO User (id, username, password, company_name) VALUES (?, ?, ?, ?)', 
      [userId, id, hashedPassword, companyName]
    );
     // 쿼리 결과 로그 출력
     console.log('DB Insert Result:', result);

    // 성공 응답
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error(err);

    // 중복 ID 에러 처리
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'User ID already exists' });
    }

    // 기타 서버 에러 처리
    res.status(500).json({ message: 'Server error' });
  }
};

  


// 로그인 로직
const loginUser = async (req, res) => {
  const { id, password } = req.body;

  try {
    console.log(`로그인 시도: id=${id}`);  // 로그인 시도 로그

    const [rows] = await db.query('SELECT * FROM User WHERE username = ?', [id]);
    if (rows.length === 0) {
      console.log('사용자를 찾을 수 없음');  // 사용자 미발견 로그
      return res.status(400).json({ message: 'User not found' });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('비밀번호 불일치');  // 비밀번호 오류 로그
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    console.log('로그인 성공, 토큰 발급');  // 로그인 성공 로그
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('서버 오류:', err);  // 서버 오류 로그
    res.status(500).json({ message: 'Server error' });
  }
};
  
  module.exports = { registerUser, loginUser };