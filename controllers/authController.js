const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { fullname, username, password} = req.body;

  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [rows] = await pool.query('INSERT INTO users (fullname, username, password) VALUES (?, ?, ?)', [fullname, username, hashedPassword]);

    res.status(201).json({ message: 'Account Registered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  const { username, password} = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

    if (!rows.length) {
      return res.status(400).json({ error: 'username incorrect' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'password incorrect. ' });
    }

    const token = jwt.sign({ id: user.user_id, username: user.username, type: user.type }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME });

    res.json({ token });

  } catch (err) {
    
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login };