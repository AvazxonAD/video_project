const ErrorResponse = require('./errorResponse');

const validationResponse = (func, data) => {
    const { error, value } = func.validate(data);
    if (error) {
        throw new ErrorResponse(error.details[0].message, 400);
    }
    return value;
}

module.exports = { validationResponse };