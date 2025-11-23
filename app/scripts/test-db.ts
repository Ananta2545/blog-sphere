import "dotenv/config";
import { Client } from "pg";

async function testDB() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is missing!");
    return;
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true, // Neon requires SSL
  });

  try {
    await client.connect();
    const res = await client.query("SELECT NOW()");
    console.log("✅ Connected:", res.rows[0]);
  } catch (err) {
    console.error("❌ DB Error:", err);
  } finally {
    await client.end();
  }
}

testDB();
