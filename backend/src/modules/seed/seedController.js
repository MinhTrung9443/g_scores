const { seed } = require('../../seeders/csvSeeder');

let isSeeding = false;

const runSeed = (req, res, next) => {
  if (isSeeding) {
    return res.status(429).json({
      message: 'The seed process is currently running. Please do not send requests multiple times.'
    });
  }

  isSeeding = true;

  seed()
    .then(result => {
      console.log('Seed process completed successfully:', result);
      isSeeding = false;
    })
    .catch(error => {
      console.error('Seed process failed:', error);
      isSeeding = false;
    });

  res.status(202).json({
    message: 'The seed process has been started'
  });
};

module.exports = {
  runSeed
};
