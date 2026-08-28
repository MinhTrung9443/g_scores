const IReportService = require('./IReportService');
const reportRepository = require('./reportRepository');

let scoreLevelsCache = null;

class ReportService extends IReportService {
  async getScoreLevels() {
    if (scoreLevelsCache) {
      return scoreLevelsCache;
    }

    const results = await reportRepository.getScoreLevelsRaw();

    const response = {};

    results.forEach(row => {
      const code = row.subject_code;
      if (!response[code]) {
        response[code] = {
          level1: 0,
          level2: 0,
          level3: 0,
          level4: 0
        };
      }
      if (row.score_level) {
        response[code][row.score_level] = parseInt(row.count, 10);
      }
    });

    scoreLevelsCache = response;
    return response;
  }

  async getTopGroupA() {
    const results = await reportRepository.getTopGroupARaw();

    return results.map((row, index) => ({
      rank: index + 1,
      registrationNumber: row.registrationNumber,
      math: parseFloat(row.math),
      physics: parseFloat(row.physics),
      chemistry: parseFloat(row.chemistry),
      total: parseFloat(row.total)
    }));
  }
}

module.exports = new ReportService();
