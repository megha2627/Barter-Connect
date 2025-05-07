const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("neon.tech")
    ? { rejectUnauthorized: false }
    : false,
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: "Email not found" });
    }
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({ token });
    } else {
      res.status(401).json({ error: "Incorrect password" });
    }
  } catch (error) {
    console.error("Login error:", error.message, error.stack);
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
});

router.get("/me", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query(
      "SELECT id, email, name, bio FROM users WHERE id = $1",
      [userId]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Auth me error:", error.message, error.stack);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

router.patch("/me", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const { bio } = req.body;
    await pool.query("UPDATE users SET bio = $1 WHERE id = $2", [bio, userId]);
    res.json({ message: "Bio updated" });
  } catch (error) {
    console.error("Update bio error:", error.message, error.stack);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

module.exports = router;
