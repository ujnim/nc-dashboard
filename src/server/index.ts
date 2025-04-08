import { createTRPCRouter } from './trpc';
import { nightCrowsRouter } from './routers/nightcrows';

export const appRouter = createTRPCRouter({
  nightCrows: nightCrowsRouter,
});

export type AppRouter = typeof appRouter;