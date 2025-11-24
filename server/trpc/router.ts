import { router } from "./init";
import { postRouter } from "./postRouter";
import { categoryRouter } from "./categoryRouter";
export const appRouter = router({
  post: postRouter,
  category: categoryRouter,
});
export type AppRouter = typeof appRouter;
