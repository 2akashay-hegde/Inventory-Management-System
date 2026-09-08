const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', ')
    });
  }

  // Mongoose duplicate key error (Unique constraint violation)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'Unique ID';
    const value = err.keyValue ? err.keyValue[field] : '';
    const fieldName = field === 'uniqueId' ? 'Unique ID' : field;
    return res.status(400).json({
      success: false,
      message: `${fieldName} "${value}" is already assigned to another product`
    });
  }

  // Mongoose invalid ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Resource not found with id ${err.value}`
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
