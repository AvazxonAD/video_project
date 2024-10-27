const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const payload = user

  const secret = process.env.JWT_SECRET;
  const options = {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  };

  const token = jwt.sign(payload, secret, options);
  return token;
};

module.exports = { generateToken };
