const express = require('express');
const router = express.Router();
const studentController = require('./studentController');
const { validateSearchStudent } = require('./studentValidator');

router.get('/:registrationNumber', validateSearchStudent, studentController.getStudentByRegistrationNumber);

module.exports = router;
