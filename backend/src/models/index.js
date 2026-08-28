const sequelize = require('../config/database');
const Student = require('./Student');
const Subject = require('./Subject');
const Score = require('./Score');
const ReportGroupA = require('./ReportGroupA');

Student.hasMany(Score, { foreignKey: 'student_id', as: 'scores' });
Score.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

Subject.hasMany(Score, { foreignKey: 'subject_id', as: 'scores' });
Score.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject' });

Student.hasOne(ReportGroupA, { foreignKey: 'student_id', as: 'reportGroupA' });
ReportGroupA.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

module.exports = {
  sequelize,
  Student,
  Subject,
  Score,
  ReportGroupA,
};
