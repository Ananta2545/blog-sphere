import "dotenv/config";
import { Client } from "pg";

async function testDB() {
  if (!process.env.DATABASE_URL) {
    console.error("âŒ DATABASE_URL is missing!");
    return;
  }
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true, 
  });
  try {
    await client.connect();
    const res = await client.query("SELECT NOW()");
    console.log("âœ… Connected:", res.rows[0]);
  } catch (err) {
    console.error("âŒ DB Error:", err);
  } finally {
    await client.end();
  }
}

testDB();
