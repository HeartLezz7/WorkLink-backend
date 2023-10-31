const validator = (shcema, body, status = 400) => {
  const { value, error } = shcema.validate(body);
  if (error) {
    error.statusCode = status;
    throw error;
  }
  return value;
};

module.exports = validator;
