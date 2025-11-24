import { db, testConnection } from "./drizzle";
import { sql } from "drizzle-orm";
async function migrate() {
  console.log("ðŸš€ Starting database migration...\n");
  const connected = await testConnection();
  if (!connected) {
    console.error("Cannot migrate: Database connection failed");
    process.exit(1);
  }
  try {
    console.log("ðŸ“ Creating tables...");
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE status AS ENUM ('DRAFT', 'PUBLISHED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
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
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT
      );
    `);
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS post_categories (
        post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        PRIMARY KEY (post_id, category_id)
      );
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
      CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
      CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
      CREATE INDEX IF NOT EXISTS idx_post_categories_post_id ON post_categories(post_id);
      CREATE INDEX IF NOT EXISTS idx_post_categories_category_id ON post_categories(category_id);
    `);
    await db.execute(sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
    await db.execute(sql`
      DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
      CREATE TRIGGER update_posts_updated_at
        BEFORE UPDATE ON posts
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log("âœ… Migration completed successfully!\n");
    console.log("ðŸ“Š Tables created:");
    console.log("  - posts");
    console.log("  - categories");
    console.log("  - post_categories");
    console.log("\nðŸŽ‰ Database is ready to use!");
  } catch (error) {
    console.error("âŒ Migration failed:", error);
    process.exit(1);
  }
  process.exit(0);
}
migrate();
