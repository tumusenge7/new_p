const DISCOUNT_TO_DB = {
  Free: 'Free',
  Percentage: 'Percentage',
  Flat_Rate: 'Flat_Rate',
  Cashback: 'Cashback',
  Buy_One_Get_One: 'Buy_One_Get_One',
  Bundle: 'Bundle',
  Amount: 'Amount',
};

const DISCOUNT_FROM_DB = Object.fromEntries(
  Object.entries(DISCOUNT_TO_DB).map(([k, v]) => [v, k])
);

function toDbDiscountType(type) {
  return DISCOUNT_TO_DB[type] || type;
}

function fromDbDiscountType(type) {
  return DISCOUNT_FROM_DB[type] || type;
}

function toDbVehicleStatus(status) {
  return status;
}

function fromDbVehicleStatus(status) {
  return status;
}

function toDbPromotionStatus(status) {
  return status;
}

function performanceLabel(score) {
  return score;
}

function performanceScore(label) {
  return label;
}

module.exports = {
  toDbDiscountType,
  fromDbDiscountType,
  toDbVehicleStatus,
  fromDbVehicleStatus,
  toDbPromotionStatus,
  performanceLabel,
  performanceScore,
};
