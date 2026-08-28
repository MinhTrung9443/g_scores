const express = require('express');
const router = express.Router();
const reportController = require('./reportController');

router.get('/score-levels', reportController.getScoreLevels);
router.get('/top-group-a', reportController.getTopGroupA);

module.exports = router;
