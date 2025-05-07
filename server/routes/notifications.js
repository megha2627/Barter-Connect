const express = require("express");
const { Pool } = require("pg");
const router = express.Router();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

module.exports = router;
