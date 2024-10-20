const jwt = require("jsonwebtoken");
exports.protect = async (req, res, next) => {
    try {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            throw new Error("Token was not provided correctly", 403);
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            throw new Error("You are not logged in", 403);
        }
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTimestamp) {
            throw new Error("Token has expired", 403);
        }
        req.user = decoded;
        next();
    } catch (error) {
        throw new Error(error.message);
    }
};
