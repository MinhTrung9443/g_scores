const reportService = require('./reportService');

const getScoreLevels = async (req, res, next) => {
  try {
    const levels = await reportService.getScoreLevels();
    res.json(levels);
  } catch (error) {
    next(error);
  }
};

const getTopGroupA = async (req, res, next) => {
  try {
    const topStudents = await reportService.getTopGroupA();
    res.json(topStudents);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getScoreLevels,
  getTopGroupA
};
