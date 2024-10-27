const jwt = require("jsonwebtoken");
const ErrorResponse = require('../utils/errorResponse');
const { errorCatch } = require('../utils/error.catch');

exports.protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith("Bearer") ? authHeader.split(" ")[1] : null;

        if (!token) {
            throw new ErrorResponse("Token was not provided correctly", 403);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000))) {
            throw new ErrorResponse("Token has expired or invalid", 403);
        }

        req.user = decoded;
        next();
    } catch (error) {
        errorCatch(error, res);
    }
};
