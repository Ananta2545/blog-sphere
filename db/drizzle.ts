import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {rejectUnauthorized: false}
});

export const db = drizzle(pool, {schema});
export async function testConnection(): Promise<boolean> {
  try {
    await pool.query("SELECT NOW()");
    console.log("âœ… DB connected");
    return true;
  } catch (err) {
    console.error("âŒ DB connection failed:", err);
    return false;
  }
}
