const express = require("express");
const { Pool } = require("pg");
const router = express.Router();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

router.get("/", async (req, res) => {
  const { userId } = req.query;
  try {
    const result = await pool.query(
      "SELECT s.*, u.name AS user_name FROM skills s JOIN users u ON s.user_id = u.id WHERE s.user_id = $1",
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch skills" });
  }
});

module.exports = router;
