import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { category, userId } = req.query;
    try {
      let query =
        "SELECT s.*, u.name AS user_name FROM skills s JOIN users u ON s.user_id = u.id";
      const params = [];
      if (category) {
        query += " WHERE s.category = $1";
        params.push(category);
      } else if (userId) {
        query += " WHERE s.user_id = $1";
        params.push(userId);
      }
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch skills" });
    }
  } else if (req.method === "POST") {
    const { userId, title, description, category } = req.body;
    try {
      const result = await pool.query(
        "INSERT INTO skills (user_id, title, description, category) VALUES ($1, $2, $3, $4) RETURNING *",
        [userId, title, description, category]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to create skill" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
