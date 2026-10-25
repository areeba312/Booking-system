class AppError extends Error {
  constructor(status, message, code) {
    super(message);
    this.status = status;
    this.appCode = code;
  }
}

const notFound = (req, res, next) => {
  next(new AppError(404, 'Route not found'));
};

const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Internal server error';
  const code = err.appCode;

  if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Invalid JSON';
  } else if (err.name === 'ValidationError') {
    status = 422;
  } else if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid id';
  } else if (err.code === 11000) {
    status = 409;
    message = 'Duplicate value';
  }

  res.status(status).json({ error: { status, message, ...(code && { code }) } });
};

module.exports = { AppError, notFound, errorHandler };
