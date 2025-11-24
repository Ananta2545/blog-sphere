import { initTRPC } from "@trpc/server";
import { Context } from "./context";
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
export const router = t.router;
export const publicProcedure = t.procedure;
export const loggerMiddleware = t.middleware(async ({ path, type, next }) => {
  const start = Date.now();
  const result = await next();
  const durationMs = Date.now() - start;
  console.log(`[tRPC] ${type} ${path} - ${durationMs}ms`);
  return result;
});
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  return next({
    ctx: {
      ...ctx,
    },
  });
});
