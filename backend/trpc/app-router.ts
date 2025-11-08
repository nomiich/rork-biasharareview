import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import syncUserRoute from "./routes/auth/sync-user/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  auth: createTRPCRouter({
    syncUser: syncUserRoute,
  }),
});

export type AppRouter = typeof appRouter;
