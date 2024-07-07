const { v4: uuidv4 } = require("uuid");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const userSchema = require("../schemas/userSchema");
const accessTokenSchema = require("../schemas/accessTokenSchema");
const config = require("../config/config"); 
const bcrypt = require("bcryptjs");
const {
  createTable,
  checkRecordExists,
  insertRecord,
} = require("../utils/sqlFunction");

const pool = mysql.createPool(config);

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const register = async (req, res) => {
    const { email, password, role = 'user' } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ error: "Email or Password fields cannot be empty!" });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = {
      userId: uuidv4(),
      email,
      password: hashedPassword,
      role
    };
    try {
      await createTable(userSchema);
      await createTable(accessTokenSchema);
      const userAlreadyExists = await checkRecordExists("users", "email", email);
      if (userAlreadyExists) {
        res.status(409).json({ error: "Email already exists" });
      } else {
        await insertRecord("users", user);
        res.status(201).json({ message: "User created successfully!" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email or Password fields cannot be empty!" });
      return;
    }
  
    try {
      const existingUser = await checkRecordExists("users", "email", email);
  
      if (existingUser) {
        if (!existingUser.password) {
          res.status(401).json({ error: "Invalid credentials" });
          return;
        }
  
        const passwordMatch = await bcrypt.compare(password, existingUser.password);
  
        if (passwordMatch) {
          const token = generateAccessToken(existingUser.userId);
          const tokenId = uuidv4();
          
          console.log("Generated Token: ", token);
          console.log("User ID: ", existingUser.userId);
          
          await insertRecord("access_tokens", { tokenId, userId: existingUser.userId, token });
          
          res.status(200).json({
            userId: existingUser.userId,
            email: existingUser.email,
            access_token: token,
            role: existingUser.role,
          });
        } else {
          res.status(401).json({ error: "Invalid credentials" });
        }
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Error during login: ", error);
      res.status(500).json({ error: error.message });
    }
  };
  

  const logout = async (req, res) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(400).json({ error: "No token provided" });
    }
  
    const token = authHeader.replace("Bearer ", "");
    try {
      // Periksa apakah token ada di database sebelum dihapus
      const tokenExists = await checkRecordExists("access_tokens", "token", token);
      if (!tokenExists) {
        return res.status(404).json({ error: "Token not found" });
      }
  
      // Hapus token dari database
      const result = await pool.promise().query("DELETE FROM access_tokens WHERE token = ?", [token]);
      if (result[0].affectedRows > 0) {
        res.status(200).json({ message: "Logout successful!" });
      } else {
        res.status(404).json({ error: "Token not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

module.exports = {
  register,
  login,
  logout
};