// src/test-db.ts
import {pool} from './models/db.js';

(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Connected to DB");
    const result = await client.query("SELECT NOW()");
    console.log(result.rows);
    client.release();
  } catch (err) {
    console.error("❌ DB test failed:", err);
  }
})();