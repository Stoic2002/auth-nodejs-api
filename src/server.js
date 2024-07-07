const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const connectDB = require("./config/database");
const port = process.env.PORT;
const authRoutes = require("./routes/authRoutes");
const verifyToken = require("./middlewares/verifyToken");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", authRoutes);
connectDB();

app.get("/api/protected", verifyToken, (req, res) => {
    res.status(200).json({ message: "Access granted" });
  });

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});