import { router } from "../trpc";
import { itemRouter } from "./item";
import { authRouter } from "./auth";
import { orderRouter } from "./order";

export const appRouter = router({
  item: itemRouter,
  auth: authRouter,
  order: orderRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
