const jwt = require("jsonwebtoken");
const createError = require("../utils/createError");

const verifyToken = (req, res, next) => {
  const token = req.headers.token; // Adjust this according to how you're sending the token

  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(createError(403, "Token is not valid!"));
    }
    req.userId = user.id; // Assuming the user ID is in the token
    next();
  });
};

module.exports = { verifyToken };
