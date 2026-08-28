const express = require('express');
const router = express.Router();
const seedController = require('./seedController');

// Route POST /api/seed
router.post('/', seedController.runSeed);

module.exports = router;
