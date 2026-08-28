const { seed } = require('../../seeders/csvSeeder');

const runSeed = async (req, res, next) => {
  try {
    const result = await seed();
    res.status(200).json({
      message: 'Database seeded successfully',
      result
    });
  } catch (error) {
    console.error('Error during seeding:', error);
    res.status(500).json({
      message: 'Failed to seed database',
      error: error.message
    });
  }
};

module.exports = {
  runSeed
};
