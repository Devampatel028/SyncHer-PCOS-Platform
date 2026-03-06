const jwt = require("jsonwebtoken");

const doctorAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.doctorId) {
      return res.status(401).json({ message: "Not a doctor token" });
    }

    req.doctorId = decoded.doctorId;
    next();
  } catch (error) {
    console.error("DOCTOR AUTH ERROR:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = doctorAuthMiddleware;
