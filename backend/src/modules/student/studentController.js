const studentService = require('./studentService');

const getStudentByRegistrationNumber = async (req, res, next) => {
  try {
    const { registrationNumber } = req.params;
    const student = await studentService.getStudentByRegistrationNumber(registrationNumber);
    
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudentByRegistrationNumber
};
