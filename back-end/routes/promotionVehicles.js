const express = require('express');
const db = require('../db');
const { fromDbDiscountType, performanceLabel, performanceScore } = require('../utils/dbMap');

const router = express.Router();

const auth = (req, res, next) => {
  if (!req.session.user) return res.status(401).json({ message: 'Unauthorized' });
  next();
};

router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT pv.id,
              pv.Promotion_id,
              pv.Vehicle_id,
              pv.Performance,
              pv.AssignedAt,
              p.Title AS PromotionTitle,
              p.Discount_Type,
              p.Discount_Value,
              p.Status AS PromotionStatus,
              v.Plate_Number, v.Brand, v.Model, v.Year, v.Vehicle_Type
       FROM Promotion_Vehicles pv
       JOIN Promotions p ON pv.Promotion_id = p.id
       JOIN Vehicles v ON pv.Vehicle_id = v.id
       ORDER BY pv.id DESC`
    );
    res.json(rows.map((r) => ({
      ...r,
      Discount_Type: fromDbDiscountType(r.Discount_Type),
      Performance: performanceLabel(r.Performance),
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/promotion/:promotionId', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT pv.id, pv.Performance, v.Plate_Number, v.Brand, v.Model, v.Year, v.Vehicle_Type, v.Status
       FROM Promotion_Vehicles pv
       JOIN Vehicles v ON pv.Vehicle_id = v.id
       WHERE pv.Promotion_id = ?`,
      [req.params.promotionId]
    );
    res.json(rows.map((r) => ({ ...r, Performance: performanceLabel(r.Performance) })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { Promotion_id, Vehicle_id, Performance } = req.body;

    const [existing] = await db.query(
      'SELECT id FROM Promotion_Vehicles WHERE Promotion_id = ? AND Vehicle_id = ?',
      [Promotion_id, Vehicle_id]
    );
    if (existing.length) return res.status(409).json({ message: 'This vehicle is already assigned to this promotion' });

    const [result] = await db.query(
      'INSERT INTO Promotion_Vehicles (Promotion_id, Vehicle_id, Performance) VALUES (?, ?, ?)',
      [Promotion_id, Vehicle_id, performanceScore(Performance)]
    );
    res.status(201).json({ id: result.insertId, message: 'Vehicle assigned to promotion' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { Performance } = req.body;
    await db.query(
      'UPDATE Promotion_Vehicles SET Performance=? WHERE id=?',
      [performanceScore(Performance), req.params.id]
    );
    res.json({ message: 'Performance updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM Promotion_Vehicles WHERE id = ?', [req.params.id]);
    res.json({ message: 'Removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
