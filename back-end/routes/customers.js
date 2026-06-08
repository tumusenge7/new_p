const express = require('express');
const db = require('../db');
const router = express.Router();

const auth = (req, res, next) => {
  if (!req.session.user) return res.status(401).json({ message: 'Unauthorized' });
  next();
};

router.get('/', auth, async (req, res) => {
  try {
    const search = req.query.search ? `%${req.query.search}%` : '%';
    const [rows] = await db.query(
      `SELECT id, FirstName, LastName, Email, PhoneNumber, Status, CreatedAt
        FROM Customers
        WHERE FirstName LIKE ? OR LastName LIKE ? OR Email LIKE ?
        ORDER BY id DESC`,
      [search, search, search]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, FirstName, LastName, Email, PhoneNumber, Status, CreatedAt FROM Customers WHERE id = ?',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { FirstName, LastName, Email, PhoneNumber, Status } = req.body;

    const [existing] = await db.query(
      'SELECT id, Email FROM Customers WHERE Email = ? OR PhoneNumber = ?',
      [Email, PhoneNumber]
    );
    if (existing.length) {
      const field = existing[0].Email === Email ? 'Email' : 'Phone number';
      return res.status(409).json({ message: `${field} already exists` });
    }

    const [result] = await db.query(
      'INSERT INTO Customers (FirstName, LastName, Email, PhoneNumber, Status) VALUES (?, ?, ?, ?, ?)',
      [FirstName, LastName, Email, PhoneNumber, Status || 'Active']
    );
    res.status(201).json({ id: result.insertId, message: 'Customer created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { FirstName, LastName, Email, PhoneNumber, Status } = req.body;

    const [existing] = await db.query(
      'SELECT id, Email FROM Customers WHERE (Email = ? OR PhoneNumber = ?) AND id != ?',
      [Email, PhoneNumber, req.params.id]
    );
    if (existing.length) {
      const field = existing[0].Email === Email ? 'Email' : 'Phone number';
      return res.status(409).json({ message: `${field} already exists` });
    }

    await db.query(
      'UPDATE Customers SET FirstName=?, LastName=?, Email=?, PhoneNumber=?, Status=? WHERE id=?',
      [FirstName, LastName, Email, PhoneNumber, Status, req.params.id]
    );
    res.json({ message: 'Customer updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM Customers WHERE id = ?', [req.params.id]);
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
