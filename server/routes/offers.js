const express = require("express");
const { Pool } = require("pg");
const router = express.Router();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = (io) => {
  router.post("/", async (req, res) => {
    const { sender_id, receiver_id, skill_offered_id, skill_requested_id } =
      req.body;
    try {
      const result = await pool.query(
        "INSERT INTO offers (sender_id, receiver_id, skill_offered_id, skill_requested_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [sender_id, receiver_id, skill_offered_id, skill_requested_id]
      );
      await pool.query(
        "INSERT INTO notifications (user_id, content) VALUES ($1, $2) RETURNING *",
        [receiver_id, "You received a new barter offer!"]
      );
      io.to(receiver_id).emit("notification", {
        message: "You received a new barter offer!",
      });
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to create offer" });
    }
  });

  router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const result = await pool.query(
        "UPDATE offers SET status = $1 WHERE id = $2 RETURNING *",
        [status, id]
      );
      if (!result.rows[0]) {
        return res.status(404).json({ error: "Offer not found" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to update offer" });
    }
  });

  return router;
};
