const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const JWT_SECRET = 'your_jwt_secret_key';


// 회원가입 로직
const registerUser = async (req, res) => {
    const { id, password, confirmPassword } = req.body;
  
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query('INSERT INTO User (username, password) VALUES (?, ?)', [id, hashedPassword]);
      res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
      console.error(err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'User ID already exists' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // 로그인 로직
  const loginUser = async (req, res) => {
    const { id, password } = req.body;
  
    try {
      const [rows] = await db.query('SELECT * FROM User WHERE username = ?', [id]);
      if (rows.length === 0) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      const user = rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password' });
      }
  
      const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  module.exports = { registerUser, loginUser };