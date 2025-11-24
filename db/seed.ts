import { db } from "./drizzle.js";
import { categories } from "./schema/index.js";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

async function seed() {
  console.log("Starting database seeding...\n");
  try {
    console.log("ðŸ“ Creating categories...");
    const categoryData = [
      {
        name: "Science",
        description: "Scientific discoveries, research, and innovations",
      },
      {
        name: "Technology",
        description: "Technology trends, programming, and software development",
      },
      {
        name: "Health",
        description: "Health, wellness, fitness, and medical topics",
      },
      {
        name: "Education",
        description: "Learning, teaching, and educational resources",
      },
      {
        name: "Entertainment",
        description: "Movies, music, games, and pop culture",
      },
      {
        name: "Travel",
        description: "Travel guides, destinations, and adventure stories",
      },
      {
        name: "Business",
        description: "Business strategies, entrepreneurship, and career advice",
      },
    ];

    const createdCategories = await Promise.all(
      categoryData.map(async (cat) => {
        const [category] = await db
          .insert(categories)
          .values({
            name: cat.name,
            slug: slugify(cat.name),
            description: cat.description,
          })
          .returning();
        return category;
      })
    );
    
    console.log(`Created ${createdCategories.length} categories\n`);
    console.log("No sample posts created - database ready for user content\n");
    const createdPosts = [];
    console.log(`No sample posts created\n`);
    console.log("Seeding completed successfully!\n");
    console.log("Summary:");
    console.log(`  - ${createdCategories.length} categories`);
    console.log(`  - ${createdPosts.length} posts`);
    console.log(`  - Database is ready for user-generated content`);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
  process.exit(0);
}

seed();
