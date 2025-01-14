// middleware/jwt.js
const jwt = require("jsonwebtoken");
const createError = require("../utils/createError");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) return next(createError(403, "Token is not valid!"));

    // Set identifier for Google users or regular users
    req.userId = decoded.uid || decoded.id; // Use uid for Google, id for regular
    next();
  });
};

const verifyTokenz = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(createError(401, "Unauthorized: No token provided."));
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(createError(403, "Forbidden: Invalid token."));
    }
    req.userId = decoded.id; // Ensure your JWT contains the user's ID as 'id'
    next();
  });
};

module.exports = { verifyToken, verifyTokenz };
