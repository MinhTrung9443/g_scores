const { param, validationResult } = require('express-validator');

const validateSearchStudent = [
  param('registrationNumber')
    .trim()
    .isLength({ min: 8, max: 8 }).withMessage('Registration number must be exactly 8 characters long')
    .isNumeric().withMessage('Registration number must contain only numbers'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateSearchStudent
};
