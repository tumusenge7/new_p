const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM Users WHERE UserName = ?', [username]);
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.Password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    req.session.user = {
      id: user.id,
      username: user.UserName,
      role: user.Role,
    };
    res.json({ message: 'Login successful', user: req.session.user });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ message: 'Logged out' }));
});

router.get('/me', (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'Not authenticated' });
  res.json(req.session.user);
});

module.exports = router;
