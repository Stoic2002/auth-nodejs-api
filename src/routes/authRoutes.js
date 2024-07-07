const express = require("express");
const { register, login, logout } = require("../controllers/authController");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/protected", verifyToken, (req, res) => {
    res.status(200).json({ message: "Access granted" });
  });

module.exports = router;