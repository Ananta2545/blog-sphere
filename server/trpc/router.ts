/**
 * Main tRPC router
 * This combines all sub-routers into a single API
 */
import { router } from "./init";
import { postRouter } from "./postRouter";
import { categoryRouter } from "./categoryRouter";

/**
 * Root application router
 * All API routes are namespaced under their respective routers
 * 
 * Available routes:
 * - post.*     - Blog post operations
 * - category.* - Category operations
 */
export const appRouter = router({
  post: postRouter,
  category: categoryRouter,
});

/**
 * Export type for use in client-side tRPC setup
 * This enables end-to-end type safety
 */
export type AppRouter = typeof appRouter;
