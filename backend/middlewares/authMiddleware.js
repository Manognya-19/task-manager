const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    // Check if token is provided and starts with Bearer
    if (token && token.startsWith("Bearer")) {
      // Extract token part
      token = token.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from DB (without password)
      req.user = await User.findById(decoded.id).select("-password");

      console.log("Decoded token payload:", decoded);

      return next(); // Allow access
    } else {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Token failed",
      error: error.message,
    });
  }
};
// Middleware for admin-only access
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  } else {
    return res.status(403).json({ message: "Access denied, admin only" });
  }
};

module.exports = { protect, adminOnly };

