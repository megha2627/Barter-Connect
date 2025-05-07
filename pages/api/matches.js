import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const { userId } = req.query;
  try {
    const result = await pool.query(
      `
      SELECT s.*, u.name AS user_name
      FROM skills s
      JOIN users u ON s.user_id = u.id
      WHERE s.category IN (
        SELECT category FROM skills WHERE user_id = $1
      ) AND s.user_id != $1
      ORDER BY s.created_at DESC
      LIMIT 10
    `,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch matches" });
  }
}
