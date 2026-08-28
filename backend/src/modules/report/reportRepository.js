const { sequelize } = require('../../models');
const IReportRepository = require('./IReportRepository');

class ReportRepository extends IReportRepository {
  async getScoreLevelsRaw() {
    const query = `
      SELECT 
        su.code as subject_code,
        s.score_level,
        s.count
      FROM subjects su
      LEFT JOIN (
        SELECT subject_id, score_level, COUNT(*) as count
        FROM scores
        GROUP BY subject_id, score_level
      ) s ON su.id = s.subject_id;
    `;
    const [results] = await sequelize.query(query);
    return results;
  }

  async getTopGroupARaw() {
    const query = `
      SELECT 
        registration_number as registrationNumber,
        math,
        physics,
        chemistry,
        total
      FROM report_group_a
      ORDER BY total DESC, registration_number ASC
      LIMIT 10;
    `;
    const [results] = await sequelize.query(query);
    return results;
  }
}

module.exports = new ReportRepository();
