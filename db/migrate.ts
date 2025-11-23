/**
 * Database Migration Script
 * Run this to push schema changes to the database
 */
import { db, testConnection } from "./drizzle";
import { sql } from "drizzle-orm";

async function migrate() {
  console.log("🚀 Starting database migration...\n");

  // Test connection first
  const connected = await testConnection();
  if (!connected) {
    console.error("Cannot migrate: Database connection failed");
    process.exit(1);
  }

  try {
    console.log("📝 Creating tables...");

    // Create enum type for post status
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE status AS ENUM ('DRAFT', 'PUBLISHED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create posts table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        status status DEFAULT 'DRAFT' NOT NULL,
        word_count INTEGER DEFAULT 0,
        reading_time_mins INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

    // Create categories table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT
      );
    `);

    // Create post_categories junction table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS post_categories (
        post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        PRIMARY KEY (post_id, category_id)
      );
    `);

    // Create indexes for better performance
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
      CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
      CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
      CREATE INDEX IF NOT EXISTS idx_post_categories_post_id ON post_categories(post_id);
      CREATE INDEX IF NOT EXISTS idx_post_categories_category_id ON post_categories(category_id);
    `);

    // Create function to update updated_at timestamp
    await db.execute(sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Create trigger to automatically update updated_at
    await db.execute(sql`
      DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
      CREATE TRIGGER update_posts_updated_at
        BEFORE UPDATE ON posts
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    console.log("✅ Migration completed successfully!\n");
    console.log("📊 Tables created:");
    console.log("  - posts");
    console.log("  - categories");
    console.log("  - post_categories");
    console.log("\n🎉 Database is ready to use!");

  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }

  process.exit(0);
}

migrate();
