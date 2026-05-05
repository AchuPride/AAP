const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack, path: req.path, method: req.method });

  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'File too large' });
  }

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Internal server error'
      : err.message;

  res.status(statusCode).json({ message });
};

const notFound = (req, res) => {
  res.status(404).json({ message: 'Route not found' });
};

module.exports = { errorHandler, notFound };
