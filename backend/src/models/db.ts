// src/models/db.ts
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
console.log("DB_USER =", process.env.DB_PASSWORD);

export const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "abcd",
  password: process.env.DB_PASSWORD || "xyz",
  port: Number(process.env.DB_PORT) || 5432,
});
