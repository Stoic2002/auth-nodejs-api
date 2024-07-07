const jwt = require("jsonwebtoken");
const { checkRecordExists } = require("../utils/sqlFunction");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    try {
      const result = await checkRecordExists("access_tokens", "token", token);
      if (!result) {
        return res.status(401).json({ error: "Invalid token" });
      }
      req.userId = decoded.userId;
      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

module.exports = verifyToken;
