const express = require('express');
const db = require('../db');
const { toDbVehicleStatus, fromDbVehicleStatus } = require('../utils/dbMap');

const router = express.Router();

const auth = (req, res, next) => {
  if (!req.session.user) return res.status(401).json({ message: 'Unauthorized' });
  next();
};

router.get('/', auth, async (req, res) => {
  try {
    const search = req.query.search ? `%${req.query.search}%` : '%';
    const [rows] = await db.query(
      `SELECT v.id, v.Plate_Number, v.Brand, v.Model, v.Year, v.Vehicle_Type,
              v.Purchase_Price, v.Status, v.RegisteredBy, v.CreatedAt, u.UserName AS RegisteredByName
       FROM Vehicles v
       LEFT JOIN Users u ON v.RegisteredBy = u.id
       WHERE v.Brand LIKE ? OR v.Model LIKE ? OR v.Plate_Number LIKE ?
       ORDER BY v.id DESC`,
      [search, search, search]
    );
    res.json(rows.map((r) => ({ ...r, Status: fromDbVehicleStatus(r.Status) })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status, RegisteredBy, CreatedAt
       FROM Vehicles WHERE id = ?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Not found' });
    const row = rows[0];
    row.Status = fromDbVehicleStatus(row.Status);
    res.json(row);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status } = req.body;

    const [existing] = await db.query(
      'SELECT id FROM Vehicles WHERE Plate_Number = ?',
      [Plate_Number]
    );
    if (existing.length) return res.status(409).json({ message: 'Plate number already exists' });

    const [result] = await db.query(
      `INSERT INTO Vehicles (Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status, RegisteredBy)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, toDbVehicleStatus(Status), req.session.user.id]
    );
    res.status(201).json({ id: result.insertId, message: 'Vehicle created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status } = req.body;

    const [existing] = await db.query(
      'SELECT id FROM Vehicles WHERE Plate_Number = ? AND id != ?',
      [Plate_Number, req.params.id]
    );
    if (existing.length) return res.status(409).json({ message: 'Plate number already exists' });

    await db.query(
      `UPDATE Vehicles SET Plate_Number=?, Brand=?, Model=?, Year=?, Vehicle_Type=?, Purchase_Price=?, Status=?
       WHERE id=?`,
      [Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, toDbVehicleStatus(Status), req.params.id]
    );
    res.json({ message: 'Vehicle updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM Vehicles WHERE id = ?', [req.params.id]);
    res.json({ message: 'Vehicle deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
