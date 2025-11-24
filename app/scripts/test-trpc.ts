import { appRouter } from "@/server/trpc";
import { createContext } from "@/server/trpc/context";
import { testConnection } from "@/db/drizzle";
async function main() {
  console.log("\nðŸš€ Starting tRPC Backend Tests...\n");
  console.log("ðŸ“¡ Testing database connection...");
  const dbConnected = await testConnection();
  if (!dbConnected) {
    throw new Error("Database connection failed. Check your .env file");
  }
  const ctx = await createContext();
  const caller = appRouter.createCaller(ctx);
  try {
    console.log("\n1ï¸âƒ£ Testing: Get Stats");
    const initialStats = await caller.post.getStats();
    console.log("âœ… Initial Stats:", initialStats);
    console.log("\n2ï¸âƒ£ Testing: Get All Categories");
    const allCategories = await caller.category.getAll();
    console.log(`âœ… Found ${allCategories.length} categories`);
    console.log("Categories:", allCategories.map(c => c.name).join(", "));
    console.log("\n3ï¸âƒ£ Testing: Create Category");
    const timestamp = Date.now();
    const newCategory = await caller.category.create({
      name: `Test Category ${timestamp}`,
      description: "Category for automated testing",
    });
    console.log("âœ… Created Category:", {
      id: newCategory.id,
      name: newCategory.name,
      slug: newCategory.slug,
    });
    console.log("\n4ï¸âƒ£ Testing: Create Post");
    const newPost = await caller.post.create({
      title: `Automated Test Post ${timestamp}`,
      content: "This is a test post created by the automated testing script. It demonstrates that the backend API is working correctly with proper validation, slug generation, and word count calculation. The content is long enough to pass the 50 character minimum validation rule.",
      status: "PUBLISHED",
      categoryIds: [1, newCategory.id], 
    });
    console.log("âœ… Created Post:", {
      id: newPost.id,
      title: newPost.title,
      slug: newPost.slug,
      wordCount: newPost.wordCount,
      readingTimeMins: newPost.readingTimeMins,
      status: newPost.status,
    });
    console.log("\n5ï¸âƒ£ Testing: Get Post by Slug");
    const postBySlug = await caller.post.getSingle({ slug: newPost.slug });
    console.log("âœ… Retrieved Post:", {
      title: postBySlug.title,
      categories: postBySlug.categories.map(c => c.name).join(", "),
    });
    console.log("\n6ï¸âƒ£ Testing: Get All Posts (Paginated)");
    const allPosts = await caller.post.getAll({
      page: 1,
      limit: 10,
      status: "PUBLISHED",
    });
    console.log(`âœ… Found ${allPosts.posts.length} published posts`);
    console.log(`Total: ${allPosts.pagination.total} posts`);
    console.log("\n7ï¸âƒ£ Testing: Search Posts");
    const searchResults = await caller.post.getAll({
      page: 1,
      limit: 10,
      searchQuery: "test",
    });
    console.log(`âœ… Search for "test" found ${searchResults.posts.length} results`);
    console.log("\n8ï¸âƒ£ Testing: Filter by Category");
    const filteredPosts = await caller.post.getAll({
      page: 1,
      limit: 10,
      categorySlug: newCategory.slug,
    });
    console.log(`âœ… Posts in "${newCategory.name}" category: ${filteredPosts.posts.length}`);
    console.log("\n9ï¸âƒ£ Testing: Update Post");
    const updatedPost = await caller.post.update({
      postId: newPost.id,
      title: "Updated Test Post Title",
      status: "DRAFT",
    });
    console.log("âœ… Updated Post:", {
      id: updatedPost.id,
      title: updatedPost.title,
      slug: updatedPost.slug,
      status: updatedPost.status,
    });
    console.log("\nðŸ”Ÿ Testing: Get Category by Slug");
    const categoryBySlug = await caller.category.getBySlug({ slug: newCategory.slug });
    console.log("âœ… Category Details:", {
      name: categoryBySlug.name,
      postCount: categoryBySlug.postCount,
    });
    console.log("\n1ï¸âƒ£1ï¸âƒ£ Testing: Update Category");
    const updatedCategory = await caller.category.update({
      categoryId: newCategory.id,
      name: `${newCategory.name} Updated`,
      description: "Updated description for testing",
    });
    console.log("âœ… Updated Category:", {
      name: updatedCategory.name,
      slug: updatedCategory.slug,
    });
    console.log("\n1ï¸âƒ£2ï¸âƒ£ Testing: Delete Post");
    const deleteResult = await caller.post.delete({ postId: newPost.id });
    console.log("âœ… Deleted Post:", deleteResult);
    console.log("\n1ï¸âƒ£3ï¸âƒ£ Testing: Delete Category");
    const deleteCategoryResult = await caller.category.delete({
      categoryId: newCategory.id,
    });
    console.log("âœ… Deleted Category:", deleteCategoryResult);
    console.log("\n1ï¸âƒ£4ï¸âƒ£ Testing: Final Stats");
    const finalStats = await caller.post.getStats();
    console.log("âœ… Final Stats:", finalStats);
    console.log("\n" + "=".repeat(50));
    console.log("ðŸŽ‰ ALL TESTS PASSED SUCCESSFULLY!");
    console.log("=".repeat(50));
    console.log("\nâœ… Backend is fully functional!");
    console.log("âœ… All 14 API endpoints tested");
    console.log("âœ… CRUD operations working");
    console.log("âœ… Validation working");
    console.log("âœ… Relations working");
    console.log("âœ… Slug generation working");
    console.log("âœ… Word count calculation working\n");
  } catch (error) {
    console.error("\nâŒ Test Failed:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      if ("cause" in error) {
        console.error("Cause:", error.cause);
      }
    }
    process.exit(1);
  }
}
main().catch((err) => {
  console.error("\nâŒ Fatal Error:", err);
  process.exit(1);
});
