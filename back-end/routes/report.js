const express = require('express');
const db = require('../db');
const { fromDbDiscountType, performanceLabel } = require('../utils/dbMap');

const router = express.Router();

const auth = (req, res, next) => {
  if (!req.session.user) return res.status(401).json({ message: 'Unauthorized' });
  next();
};

router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
         v.id AS VehicleId,
         v.Plate_Number,
         v.Brand AS VehicleBrand,
         v.Model AS VehicleModel,
         v.Vehicle_Type,
         v.Year,
         v.Status AS VehicleStatus,
         p.Title AS PromotionTitle,
         p.Discount_Type,
         p.Discount_Value,
         p.Start_Date,
         p.End_Date,
         p.Status AS PromotionStatus,
         pv.Performance
       FROM Promotion_Vehicles pv
       JOIN Vehicles v ON pv.Vehicle_id = v.id
       JOIN Promotions p ON pv.Promotion_id = p.id
       WHERE p.Status = 'Active'
       ORDER BY p.Title, v.Brand, v.Model`
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

module.exports = router;
