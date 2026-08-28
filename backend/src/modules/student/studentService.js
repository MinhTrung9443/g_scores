const IStudentService = require('./IStudentService');
const studentRepository = require('./studentRepository');

class StudentService extends IStudentService {
  async getStudentByRegistrationNumber(registrationNumber) {
    const student = await studentRepository.findByRegistrationNumber(registrationNumber);

    if (!student) return null;

    const scoreMap = {
      math: null,
      literature: null,
      foreignLanguage: null,
      physics: null,
      chemistry: null,
      biology: null,
      history: null,
      geography: null,
      civicEducation: null
    };

    if (student.scores) {
      student.scores.forEach(s => {
        if (s.subject && s.subject.code) {
          scoreMap[s.subject.code] = s.score;
        }
      });
    }

    return {
      registrationNumber: student.registration_number,
      scores: scoreMap
    };
  }
}

module.exports = new StudentService();
