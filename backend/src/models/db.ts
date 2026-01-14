import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in .env file");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Supabase requires SSL
  },
});

// Optional: test connection when starting up
pool.connect()
  .then(client => {
    console.log("✅ Connected to Supabase Postgres");
    client.release();
  })
  .catch(err => {
    console.error("❌ Database connection error:", err);
  });
