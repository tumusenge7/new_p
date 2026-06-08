const express = require('express');
const db = require('../db');
const { toDbDiscountType, fromDbDiscountType, toDbPromotionStatus } = require('../utils/dbMap');

const router = express.Router();

const auth = (req, res, next) => {
  if (!req.session.user) return res.status(401).json({ message: 'Unauthorized' });
  next();
};

router.get('/', auth, async (req, res) => {
  try {
    const search = req.query.search ? `%${req.query.search}%` : '%';
    const [rows] = await db.query(
      `SELECT p.id, p.Title, p.Description, p.Discount_Type, p.Discount_Value,
              p.Start_Date, p.End_Date, p.Status, p.CreatedBy, p.CreatedAt, u.UserName AS CreatedByName
       FROM Promotions p
       LEFT JOIN Users u ON p.CreatedBy = u.id
       WHERE p.Title LIKE ? OR p.Discount_Type LIKE ? OR p.Status LIKE ?
       ORDER BY p.id DESC`,
      [search, search, search]
    );
    res.json(rows.map((r) => ({
      ...r,
      Discount_Type: fromDbDiscountType(r.Discount_Type),
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, Title, Description, Discount_Type, Discount_Value, Start_Date, End_Date, Status, CreatedBy, CreatedAt
       FROM Promotions WHERE id = ?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Not found' });
    const row = rows[0];
    row.Discount_Type = fromDbDiscountType(row.Discount_Type);
    res.json(row);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { Title, Description, Discount_Type, Discount_Value, Start_Date, End_Date, Status } = req.body;
    const [result] = await db.query(
      `INSERT INTO Promotions (Title, Description, Discount_Type, Discount_Value, Start_Date, End_Date, Status, CreatedBy)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        Title, Description, toDbDiscountType(Discount_Type), Discount_Value,
        Start_Date, End_Date, toDbPromotionStatus(Status || 'Active'), req.session.user.id,
      ]
    );
    res.status(201).json({ id: result.insertId, message: 'Promotion created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { Title, Description, Discount_Type, Discount_Value, Start_Date, End_Date, Status } = req.body;
    await db.query(
      `UPDATE Promotions SET Title=?, Description=?, Discount_Type=?, Discount_Value=?,
       Start_Date=?, End_Date=?, Status=? WHERE id=?`,
      [
        Title, Description, toDbDiscountType(Discount_Type), Discount_Value,
        Start_Date, End_Date, toDbPromotionStatus(Status), req.params.id,
      ]
    );
    res.json({ message: 'Promotion updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM Promotions WHERE id = ?', [req.params.id]);
    res.json({ message: 'Promotion deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
