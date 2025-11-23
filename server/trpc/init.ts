/**
 * tRPC initialization and configuration
 * This file sets up the tRPC instance, router, and procedures
 */
import { initTRPC } from "@trpc/server";
import { Context } from "./context";

/**
 * Initialize tRPC with the context type
 */
const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause && typeof error.cause === "object" && "issues" in error.cause
            ? error.cause.issues
            : null,
      },
    };
  },
});

/**
 * Export reusable router and procedure helpers
 */
export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Middleware for logging requests (optional, for debugging)
 */
export const loggerMiddleware = t.middleware(async ({ path, type, next }) => {
  const start = Date.now();
  const result = await next();
  const durationMs = Date.now() - start;
  
  console.log(`[tRPC] ${type} ${path} - ${durationMs}ms`);
  
  return result;
});

/**
 * Example protected procedure (for future authentication)
 * You can use this when you add authentication
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  // Add authentication check here
  // if (!ctx.session?.user) {
  //   throw new TRPCError({ code: "UNAUTHORIZED" });
  // }
  
  return next({
    ctx: {
      ...ctx,
      // user: ctx.session.user,
    },
  });
});
