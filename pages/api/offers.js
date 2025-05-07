import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { userId } = req.query;
    try {
      const result = await pool.query(
        "SELECT o.*, s1.title AS skill_offered_title, s2.title AS skill_requested_title " +
          "FROM offers o " +
          "JOIN skills s1 ON o.skill_offered_id = s1.id " +
          "JOIN skills s2 ON o.skill_requested_id = s2.id " +
          "WHERE o.sender_id = $1 OR o.receiver_id = $1",
        [userId]
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch offers" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
