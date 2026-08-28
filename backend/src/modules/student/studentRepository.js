const { Student, Score, Subject } = require('../../models');
const IStudentRepository = require('./IStudentRepository');

class StudentRepository extends IStudentRepository {
  async findByRegistrationNumber(registrationNumber) {
    const student = await Student.findOne({
      where: { registration_number: registrationNumber },
      include: [
        {
          model: Score,
          as: 'scores',
          include: [{ model: Subject, as: 'subject' }]
        }
      ]
    });
    return student;
  }
}

module.exports = new StudentRepository();
