import { Pool } from "pg";
import bcrypt from "bcrypt";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("neon.tech")
    ? { rejectUnauthorized: false }
    : false,
});

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res
      .status(400)
      .json({ error: "Missing required fields: email, password, name" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id",
      [email, hashedPassword, name]
    );
    res.status(201).json({ userId: result.rows[0].id });
  } catch (error) {
    console.error("Signup error:", error.message, error.stack);
    if (error.code === "23505") {
      res.status(400).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: `Server error: ${error.message}` });
    }
  }
}
